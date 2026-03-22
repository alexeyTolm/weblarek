import "./scss/styles.scss";
import { AppApi } from "./components/AppApi";
import { ProductData } from "./components/models/productData";

// Константы (адреса из инструкции)
const API_URL = "https://larek-api.nomoreparties.co/api/weblarek";
const CDN_URL = "https://larek-api.nomoreparties.co/content/weblarek";

// 1. Инициализируем API и Модель
const api = new AppApi(CDN_URL, API_URL);
const productsModel = new ProductData();

// 2. Получаем данные с сервера
api
  .getProductList()
  .then((items) => {
    // 3. Сохраняем полученные данные в модель каталога
    productsModel.setProducts(items);

    // 4. Проверяем результат в консоли
    console.log("Данные загружены с сервера и сохранены в модель:");
    console.log(productsModel.getProducts());
  })
  .catch((err) => {
    console.error("Ошибка загрузки данных:", err);
  });
