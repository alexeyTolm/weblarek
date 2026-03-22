import "./scss/styles.scss";
import { AppApi } from "./components/AppApi";
import { ProductData } from "./components/models/productData";

import { API_URL, CDN_URL } from "./utils/constants";

const api = new AppApi(CDN_URL, API_URL);
const productsModel = new ProductData();

api
  .getProductList()
  .then((items) => {
    productsModel.setProducts(items);

    console.log("Данные загружены с сервера и сохранены в модель:");
    console.log(productsModel.getProducts());
  })
  .catch((err) => {
    console.error("Ошибка загрузки данных:", err);
  });
