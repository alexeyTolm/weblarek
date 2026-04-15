import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

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
    this._list = ensureElement(".basket__list", container);
    this._total = ensureElement(".basket__price", container);
    this._button = ensureElement(
      ".basket__button",
      container,
    ) as HTMLButtonElement;

    this._button.addEventListener("click", () => {
      this.events.emit("order:start");
    });
  }

  set items(items: HTMLElement[]) {
    this._list.replaceChildren(...items);
  }

  set total(value: number) {
    this._total.textContent = `${value} синапсов`;
  }

  set disabled(value: boolean) {
    this._button.disabled = value;
  }

  get element(): HTMLElement {
    return this.container;
  }
}
