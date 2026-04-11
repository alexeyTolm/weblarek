import "./scss/styles.scss";
import { AppApi } from "./components/AppApi";
import { ProductData } from "./components/models/ProductData";
import { BasketData } from "./components/models/BasketData";
import { UserData } from "./components/models/UserData";
import { EventEmitter } from "./components/base/Events";
import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { Page } from "./components/view/page";
import { Modal } from "./components/view/Modal";
import { Basket } from "./components/view/Basket";
import { CardCatalog } from "./components/view/CardCatalog";
import { CardPreview } from "./components/view/CardPreview";
import { CardBasket } from "./components/view/CardBasket";
import { OrderForm } from "./components/view/OrderForm";
import { ContactsForm } from "./components/view/ContactsForm";
import { Success } from "./components/view/Success";

import { IProduct, IOrder } from "./types";

// Инициализация брокера событий
const events = new EventEmitter();

// Инициализация API и моделей данных
const api = new AppApi(CDN_URL, API_URL);
const productModel = new ProductData(events);
const basketModel = new BasketData(events);
const userModel = new UserData(events);

const pageContainer = ensureElement(".page__wrapper");
const page = new Page(pageContainer);

const modalContainer = ensureElement("#modal-container");
const modal = new Modal(modalContainer, events);

const basketTemplate = ensureElement("#basket") as HTMLTemplateElement;
const basketComponent = new Basket(cloneTemplate(basketTemplate));

const cardCatalogTemplate = ensureElement(
  "#card-catalog",
) as HTMLTemplateElement;
const cardPreviewTemplate = ensureElement(
  "#card-preview",
) as HTMLTemplateElement;
const cardBasketTemplate = ensureElement("#card-basket") as HTMLTemplateElement;

const orderTemplate = ensureElement("#order") as HTMLTemplateElement;
const contactsTemplate = ensureElement("#contacts") as HTMLTemplateElement;
const successTemplate = ensureElement("#success") as HTMLTemplateElement;

// Обновление каталога товаров
events.on("products:changed", (products: IProduct[]) => {
  const cards = products.map((product) => {
    const cardElement = cloneTemplate(cardCatalogTemplate);
    const card = new CardCatalog(cardElement, {
      onClick: () => events.emit("card:select", product),
    });
    card.render(product);
    return cardElement;
  });
  page.render({ counter: basketModel.getCounter(), items: cards });
});

// Обновление счётчика корзины
events.on("basket:changed", () => {
  page.counter = basketModel.getCounter();
});

// Обновление превью товара
events.on('preview:changed', (product: IProduct) => {
  const cardElement = cloneTemplate(cardPreviewTemplate);
  const card = new CardPreview(cardElement, {
    onClick: () => {
      if (basketModel.inBasket(product.id)) {
        basketModel.removeItem(product.id);
      } else {
        basketModel.addItem(product);
      }
      const updatedProduct = {
        ...product,
        inBasket: basketModel.inBasket(product.id)
      };
      events.emit('preview:changed', updatedProduct);
      events.emit('basket:changed');
    }
  });
  
  card.render({
    ...product,
    inBasket: basketModel.inBasket(product.id)
  });
  
  modal.render({ content: cardElement });
});


// Выбор карточки для просмотра
events.on("card:select", (product: IProduct) => {
  productModel.setPreview(product);
});

// Открытие корзины
events.on('basket:open', () => {
  basketComponent.onCheckout(() => {});
  
  const basketItems = basketModel.getItems().map((item, index) => {
    const cardElement = cloneTemplate(cardBasketTemplate);
    const card = new CardBasket(cardElement, {
      onClick: () => {
        basketModel.removeItem(item.id);
        events.emit('basket:open');
      }
    });
    card.render({ ...item, index: index + 1 });
    return cardElement;
  });
  
  const basketView = basketComponent.render({
    items: basketItems,
    total: basketModel.getTotalPrice()
  });
  
  basketComponent.onCheckout(() => events.emit('order:start'));
  modal.render({ content: basketView });
});

events.on("basket:changed", () => {
  page.counter = basketModel.getCounter();
});

// Начало оформления заказа
events.on("order:start", () => {
  const orderFormElement = cloneTemplate(orderTemplate) as HTMLFormElement;
  const orderForm = new OrderForm(orderFormElement);

  orderForm.valid = false;

  orderFormElement.addEventListener("change", () => {
    const data = orderForm.getData();
    userModel.setUserData("payment", data.payment);
    userModel.setUserData("address", data.address);

    const errors = userModel.validateUserData();
    orderForm.valid = !errors.payment && !errors.address;
    orderForm.errors = errors.payment || errors.address || "";
  });

  orderFormElement.addEventListener("submit", (e) => {
    e.preventDefault();
    events.emit("order:submit");
  });

  modal.render({ content: orderFormElement });
});

// Переход ко второй форме
events.on("order:submit", () => {
  const contactsFormElement = cloneTemplate(
    contactsTemplate,
  ) as HTMLFormElement;
  const contactsForm = new ContactsForm(contactsFormElement);

  contactsForm.valid = false;

  contactsFormElement.addEventListener("change", () => {
    const data = contactsForm.getData();
    userModel.setUserData("email", data.email);
    userModel.setUserData("phone", data.phone);

    const errors = userModel.validateUserData();
    contactsForm.valid = !errors.email && !errors.phone;
    contactsForm.errors = errors.email || errors.phone || "";
  });

  contactsFormElement.addEventListener("submit", (e) => {
    e.preventDefault();
    events.emit("order:complete");
  });

  modal.render({ content: contactsFormElement });
});

// Завершение оформления заказа
events.on("order:complete", async () => {
  const order: IOrder = {
    ...userModel.getUserData(),
    items: basketModel.getItems().map((item) => item.id),
    total: basketModel.getTotalPrice(),
  };

  try {
    const result = await api.orderProducts(order);
    basketModel.clearBasket();
    userModel.clearUserData();

    const successElement = cloneTemplate(successTemplate);
    const success = new Success(successElement, () => {
      modal.close();
    });
    success.total = result.total;
    modal.render({ content: successElement });
  } catch (error) {
    console.error("Ошибка при оформлении заказа:", error);
  }
});

// Закрытие модального окна
events.on("modal:close", () => {

});


api
  .getProductList()
  .then((products) => {
    productModel.setProducts(products);
  })
  .catch((error) => {
    console.error("Ошибка загрузки товаров:", error);
  });


page.onBasketClick(() => events.emit("basket:open"));
