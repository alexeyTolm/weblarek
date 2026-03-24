import "./scss/styles.scss";
import { AppApi } from "./components/AppApi";
import { ProductData } from "./components/models/ProductData";
import { BasketData } from "./components/models/BasketData";
import { UserData } from "./components/models/UserData";
import { API_URL, CDN_URL } from "./utils/constants";
import { apiProducts } from "./utils/data";

// Инициализация моделей и API
const api = new AppApi(CDN_URL, API_URL);
const productModel = new ProductData();
const basketModel = new BasketData();
const userModel = new UserData();

/**
 * ТЕСТИРОВАНИЕ МОДЕЛИ КАТАЛОГА (ProductData)
 */
console.log("--- ТЕСТ: ProductData (на статических данных) ---");

// 1. Запись массива и вывод списка
productModel.setProducts(apiProducts.items);
console.log("Список продуктов после сохранения:", productModel.getProducts());

// 2. Поиск продукта по ID (берем ID первого элемента из статики)
const testId = apiProducts.items[0].id;
console.log(
  `Поиск продукта по ID (${testId}):`,
  productModel.getProduct(testId),
);

// 3. Сохранение и получение предпросмотра
productModel.setPreview(apiProducts.items[0]);
console.log("Выводим текущий продукт (Preview):", productModel.getPreview());

/**
 * ТЕСТИРОВАНИЕ МОДЕЛИ КОРЗИНЫ (BasketData)
 */
console.log("--- ТЕСТ: BasketData ---");

// Добавление товара
basketModel.addItem(apiProducts.items[0]);
basketModel.addItem(apiProducts.items[1]);
console.log(
  "Содержимое корзины после добавления 2-х товаров:",
  basketModel.getItems(),
);
console.log("Количество товаров в корзине:", basketModel.getCounter());
console.log("Итоговая сумма корзины:", basketModel.getTotalPrice());

// Проверка наличия
console.log("Товар в корзине (проверка по ID):", basketModel.inBasket(testId));

// Удаление товара
basketModel.removeItem(testId);
console.log("Корзина после удаления одного товара:", basketModel.getItems());

// Очистка
basketModel.clearBasket();
console.log("Корзина после полной очистки:", basketModel.getItems());

/**
 * ТЕСТИРОВАНИЕ МОДЕЛИ ПОКУПАТЕЛЯ (UserData)
 */
console.log("--- ТЕСТ: UserData ---");

// Валидация пустой модели
console.log("Ошибки валидации пустой формы:", userModel.validateUserData());

// Заполнение данных
userModel.setUserData("payment", "online");
userModel.setUserData("email", "test@test.ru");
console.log(
  "Данные пользователя после частичного заполнения:",
  userModel.getUserData(),
);
console.log(
  "Ошибки после ввода email и оплаты (ожидаем отсутствие адреса и телефона):",
  userModel.validateUserData(),
);

// Очистка
userModel.clearUserData();
console.log("Данные пользователя после очистки:", userModel.getUserData());

/**
 * ПРОВЕРКА РАБОТЫ С API
 */
console.log("--- ТЕСТ: Работа с сервером через AppApi ---");

api
  .getProductList()
  .then((items) => {
    productModel.setProducts(items);
    console.log("Данные успешно загружены с сервера и обновлены в модели:");
    console.log(productModel.getProducts());
  })
  .catch((err) => console.error("Ошибка API:", err));
