import { Api } from "./base/Api";
import { IProduct, IOrder, IOrderResult, IProductResponse } from "../types";

export class AppApi extends Api {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  async getProductList(): Promise<IProduct[]> {
    return this.get<IProductResponse>("/product").then(
      (data: IProductResponse) =>
        data.items.map((item) => ({
          ...item,
          image: this.cdn + item.image,
        })),
    );
  }

  async orderProducts(order: IOrder): Promise<IOrderResult> {
    return this.post<IOrderResult>("/order", order).then(
      (data: IOrderResult) => data,
    );
  }
}
