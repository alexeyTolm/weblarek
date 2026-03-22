import { IProduct } from "../../types";

export class BasketData {
  protected items: IProduct[] = [];

  constructor() {
    this.items = [];
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct) {
    this.items.push(item);
  }

  removeItem(id: string) {
    this.items = this.items.filter((item) => item.id !== id);
  }

  clearBasket(): void {
    this.items = [];
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price || 0), 0);
  }

  getCounter(): number {
    return this.items.length;
  }

  inBasket(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}