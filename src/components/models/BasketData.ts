import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class BasketData {
  protected items: IProduct[] = [];
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
    this.items = [];
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct) {
    this.items.push(item);
    this.events.emit("basket:changed", this.items);
  }

  removeItem(id: string) {
    this.items = this.items.filter((item) => item.id !== id);
    this.events.emit("basket:changed", this.items);
  }

  clearBasket(): void {
    this.items = [];
    this.events.emit("basket:changed", this.items);
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
