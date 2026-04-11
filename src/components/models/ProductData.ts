import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ProductData {
  protected _products: IProduct[] = [];
  protected _preview: IProduct | null = null;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  setProducts(items: IProduct[]): void {
    this._products = items;
    this.events.emit("products:changed", this._products);
  }

  getProducts(): IProduct[] {
    return this._products;
  }

  getProduct(id: string): IProduct | undefined {
    return this._products.find((item) => item.id === id);
  }

  setPreview(item: IProduct): void {
    this._preview = item;
    this.events.emit("preview:changed", this._preview);
  }

  getPreview(): IProduct | null {
    return this._preview;
  }
}
