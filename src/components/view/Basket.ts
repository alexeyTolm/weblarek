import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IBasketView {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasketView> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this._list = container.querySelector(".basket__list")!;
    this._total = container.querySelector(".basket__price")!;
    this._button = container.querySelector(".basket__button")!;

    if (this._button) {
      this._button.addEventListener("click", () => {
        this.events.emit("order:start");
      });
    }
  }

  set items(items: HTMLElement[]) {
    if (this._list) {
      this._list.replaceChildren(...items);
    }
  }

  set total(value: number) {
    if (this._total) {
      this._total.textContent = `${value} синапсов`;
    }
  }

  set disabled(value: boolean) {
    if (this._button) {
      this._button.disabled = value;
    }
  }

}
