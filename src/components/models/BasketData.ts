import { IProduct } from "../../types";

export class BasketData {
  protected _items: IProduct[] = [];

  constructor() {
    this._items = [];
  }

  getItems(): IProduct[] {
    return this._items;
  }

  addItem(item: IProduct) {
    this._items.push(item);
  }

  removeItem(id: string) {
    this._items = this._items.filter((item) => item.id !== id);
  }

  clearBasket(): void {
    this._items = [];
  }

  getTotalPrice(): number {
    return this._items.reduce((total, item) => total + (item.price || 0), 0);
  }

  getCounter(): number {
    return this._items.length;
  }

  inBasket(id: string): boolean {
    return this._items.some((item) => item.id === id);
  }
}