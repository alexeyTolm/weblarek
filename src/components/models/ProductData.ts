import { IProduct } from "../../types";

export class ProductData {
  protected _products: IProduct[] = [];
  protected _preview: IProduct | null = null;

  constructor() {}

  setProducts(items: IProduct[]): void {
    this._products = items;
  }

  getProducts(): IProduct[] {
    return this._products;
  }

  getProduct(id: string): IProduct | undefined {
    return this._products.find((item) => item.id === id);
  }

  setPreview(item: IProduct): void {
    this._preview = item;
  }

  getPreview(): IProduct | null {
    return this._preview;
  }
}
