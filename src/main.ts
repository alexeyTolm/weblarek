import "./scss/styles.scss";
import { AppApi } from "./components/AppApi";
import { ProductData } from "./components/models/ProductData";
import { BasketData } from "./components/models/BasketData";
import { UserData } from "./components/models/UserData";
import { EventEmitter } from "./components/base/Events";
import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { Page } from "./components/view/Page";
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


// Page
const pageContainer = ensureElement(".page__wrapper");
const page = new Page(pageContainer, events);

// Modal
const modalContainer = ensureElement("#modal-container");
const modal = new Modal(modalContainer, events);

// Basket
const basketTemplate = ensureElement("#basket") as HTMLTemplateElement;
const basketComponent = new Basket(cloneTemplate(basketTemplate), events);

// CardPreview
const cardPreviewTemplate = ensureElement(
  "#card-preview",
) as HTMLTemplateElement;
const cardPreviewElement = cloneTemplate(cardPreviewTemplate);
const cardPreview = new CardPreview(cardPreviewElement, {
  onClick: () => events.emit("preview:buttonClick"),
});

// OrderForm
const orderTemplate = ensureElement("#order") as HTMLTemplateElement;
const orderFormElement = cloneTemplate(orderTemplate) as HTMLFormElement;
const orderForm = new OrderForm(orderFormElement, events);

// ContactsForm
const contactsTemplate = ensureElement("#contacts") as HTMLTemplateElement;
const contactsFormElement = cloneTemplate(contactsTemplate) as HTMLFormElement;
const contactsForm = new ContactsForm(contactsFormElement, events);

// Success
const successTemplate = ensureElement("#success") as HTMLTemplateElement;
const successElement = cloneTemplate(successTemplate);
const success = new Success(successElement, events);

// Хранилище для текущего товара в превью
let currentPreviewProduct: IProduct | null = null;

// Флаг для предотвращения множественных отправок
let isOrderProcessing = false;


// Обновление каталога товаров
events.on("products:changed", (products: IProduct[]) => {
  const cardCatalogTemplate = ensureElement(
    "#card-catalog",
  ) as HTMLTemplateElement;

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

// Обновление счётчика корзины и содержимого корзины
events.on("basket:changed", () => {
  page.counter = basketModel.getCounter();

  const cardBasketTemplate = ensureElement(
    "#card-basket",
  ) as HTMLTemplateElement;

  let basketItems: HTMLElement[];

  if (basketModel.getItems().length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Корзина пуста";
    emptyMessage.style.textAlign = "center";
    emptyMessage.style.padding = "20px";
    basketItems = [emptyMessage];
  } else {
    basketItems = basketModel.getItems().map((item, index) => {
      const cardElement = cloneTemplate(cardBasketTemplate);
      const card = new CardBasket(cardElement, {
        onClick: () => events.emit("basket:remove", { id: item.id }),
      });
      card.render({ ...item, index: index + 1 });
      return cardElement;
    });
  }

  basketComponent.items = basketItems;
  basketComponent.total = basketModel.getTotalPrice();
  basketComponent.disabled = basketModel.getItems().length === 0;
});

// Обновление превью товара
events.on("preview:changed", (product: IProduct) => {
  currentPreviewProduct = product;

  const inBasket = basketModel.inBasket(product.id);
  const isPriceNull = product.price === null;

  let buttonText = "";
  let buttonDisabled = false;

  if (isPriceNull) {
    buttonText = "Недоступно";
    buttonDisabled = true;
  } else {
    buttonText = inBasket ? "Убрать из корзины" : "В корзину";
    buttonDisabled = false;
  }

  cardPreview.render({
    ...product,
    buttonText,
    buttonDisabled,
  });

  modal.render({ content: cardPreview.element });
});


// Выбор карточки для просмотра
events.on("card:select", (product: IProduct) => {
  productModel.setPreview(product);
});

// Клик по кнопке в превью
events.on("preview:buttonClick", () => {
  if (!currentPreviewProduct) return;
  if (currentPreviewProduct.price === null) return;

  if (basketModel.inBasket(currentPreviewProduct.id)) {
    basketModel.removeItem(currentPreviewProduct.id);
  } else {
    basketModel.addItem(currentPreviewProduct);
  }
  modal.close();
});

// Удаление товара из корзины
events.on("basket:remove", (data: { id: string }) => {
  basketModel.removeItem(data.id);
});

// Открытие корзины
events.on("basket:open", () => {
  modal.render({ content: basketComponent.element });
});

// Начало оформления заказа
events.on("order:start", () => {
  const userData = userModel.getUserData();
  orderForm.payment = userData.payment;
  orderForm.address = userData.address;
  modal.render({ content: orderForm.element });
});

// Изменение способа оплаты
events.on("order:paymentSelected", (data: { payment: string }) => {
  userModel.setUserData("payment", data.payment);
  const userData = userModel.getUserData();
  orderForm.payment = userData.payment;
  orderForm.address = userData.address;
  const errors = userModel.validateUserData();
  orderForm.valid = !errors.payment && !errors.address;
  orderForm.errors = errors.payment || errors.address || "";
});

events.on("order:addressChanged", (data: { address: string }) => {
  userModel.setUserData("address", data.address);
  const userData = userModel.getUserData();
  orderForm.payment = userData.payment;
  orderForm.address = userData.address;
  const errors = userModel.validateUserData();
  orderForm.valid = !errors.payment && !errors.address;
  orderForm.errors = errors.payment || errors.address || "";
});

// Отправка формы заказа
events.on("order:submit", () => {
  const userData = userModel.getUserData();
  contactsForm.email = userData.email;
  contactsForm.phone = userData.phone;
  modal.render({ content: contactsForm.element });
});

// Изменение email
events.on("contacts:emailChanged", (data: { email: string }) => {
  userModel.setUserData("email", data.email);
  const userData = userModel.getUserData();
  contactsForm.email = userData.email;
  contactsForm.phone = userData.phone;
  const errors = userModel.validateUserData();
  contactsForm.valid = !errors.email && !errors.phone;
  contactsForm.errors = errors.email || errors.phone || "";
});

// Изменение телефона
events.on("contacts:phoneChanged", (data: { phone: string }) => {
  userModel.setUserData("phone", data.phone);
  const userData = userModel.getUserData();
  contactsForm.email = userData.email;
  contactsForm.phone = userData.phone;
  const errors = userModel.validateUserData();
  contactsForm.valid = !errors.email && !errors.phone;
  contactsForm.errors = errors.email || errors.phone || "";
});

// Отправка формы контактов
events.on("contacts:submit", async () => {
  if (isOrderProcessing) return;
  if (basketModel.getItems().length === 0) return;

  isOrderProcessing = true;

  const order: IOrder = {
    ...userModel.getUserData(),
    items: basketModel.getItems().map((item) => item.id),
    total: basketModel.getTotalPrice(),
  };

  try {
    const result = await api.orderProducts(order);
    basketModel.clearBasket();
    userModel.clearUserData();
    success.total = result.total;
    modal.render({ content: success.element });
  } catch (error) {
    console.error("Ошибка при оформлении заказа:", error);
  } finally {
    setTimeout(() => {
      isOrderProcessing = false;
    }, 1000);
  }
});

// Закрытие успешного заказа
events.on("success:close", () => {
  modal.close();
});

api
  .getProductList()
  .then((products) => {
    productModel.setProducts(products);
  })
  .catch((error) => {
    console.error("Ошибка загрузки товаров:", error);
  });
