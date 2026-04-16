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
import { Gallery } from "./components/view/Gallery";
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


// Page - для хедера
const pageContainer = ensureElement(".page__content");
const page = new Page(pageContainer, events);

// Gallery - для отображения карточек
const gallery = new Gallery(pageContainer);

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
const cardPreview = new CardPreview(cardPreviewElement, () =>
  events.emit("preview:buttonClick"),
);

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

// Обновление каталога товаров
events.on("products:changed", () => {
  const products = productModel.getProducts();
  const cardCatalogTemplate = ensureElement(
    "#card-catalog",
  ) as HTMLTemplateElement;

  const cards = products.map((product) => {
    const cardElement = cloneTemplate(cardCatalogTemplate);
    const card = new CardCatalog(cardElement, () =>
      events.emit("card:select", product),
    );
    card.render(product);
    return cardElement;
  });

  page.counter = basketModel.getCounter();
  gallery.items = cards;
});

// Обновление корзины
events.on("basket:changed", () => {
  page.counter = basketModel.getCounter();

  const cardBasketTemplate = ensureElement(
    "#card-basket",
  ) as HTMLTemplateElement;

  const basketItems = basketModel.getItems().map((item, index) => {
    const cardElement = cloneTemplate(cardBasketTemplate);
    const card = new CardBasket(cardElement, () =>
      events.emit("basket:remove", { id: item.id }),
    );
    card.render({ ...item, index: index + 1 });
    return cardElement;
  });

  basketComponent.items = basketItems;
  basketComponent.total = basketModel.getTotalPrice();
  basketComponent.disabled = basketModel.getItems().length === 0;
});

// Обновление форм при изменении данных пользователя
events.on("user:changed", () => {
  const errors = userModel.validateUserData();
  orderForm.valid = !errors.payment && !errors.address;
  orderForm.errors = errors.payment || errors.address || "";
  contactsForm.valid = !errors.email && !errors.phone;
  contactsForm.errors = errors.email || errors.phone || "";
});

// Обновление превью товара
events.on("preview:changed", () => {
  const product = productModel.getPreview();
  if (!product) return;

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

  modal.render({ content: cardPreview.render() });
});


// Выбор карточки для просмотра
events.on("card:select", (product: IProduct) => {
  productModel.setPreview(product);
});

// Клик по кнопке в превью
events.on("preview:buttonClick", () => {
  const product = productModel.getPreview();
  if (!product) return;
  if (product.price === null) return;

  if (basketModel.inBasket(product.id)) {
    basketModel.removeItem(product.id);
  } else {
    basketModel.addItem(product);
  }
  modal.close();
});

// Удаление товара из корзины
events.on("basket:remove", (data: { id: string }) => {
  basketModel.removeItem(data.id);
});

// Открытие корзины
events.on("basket:open", () => {
  modal.render({ content: basketComponent.render() });
});

// Начало оформления заказа
events.on("order:start", () => {
  const userData = userModel.getUserData();
  orderForm.payment = userData.payment;
  orderForm.address = userData.address;
  modal.render({ content: orderForm.render() });
});


// Изменение способа оплаты
events.on("order:paymentSelected", (data: { payment: string }) => {
  userModel.setUserData("payment", data.payment);
});

// Изменение адреса
events.on("order:addressChanged", (data: { address: string }) => {
  userModel.setUserData("address", data.address);
});

// Отправка формы заказа
events.on("order:submit", () => {
  const userData = userModel.getUserData();
  contactsForm.email = userData.email;
  contactsForm.phone = userData.phone;
  modal.render({ content: contactsForm.render() });
});

// Изменение email
events.on("contacts:emailChanged", (data: { email: string }) => {
  userModel.setUserData("email", data.email);
});

// Изменение телефона
events.on("contacts:phoneChanged", (data: { phone: string }) => {
  userModel.setUserData("phone", data.phone);
});

// Отправка формы контактов
events.on("contacts:submit", async () => {
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
    modal.render({ content: success.render() });
  } catch (error) {
    console.error("Ошибка при оформлении заказа:", error);
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
