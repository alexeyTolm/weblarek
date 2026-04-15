import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IPageView {
  counter: number;
}

export class Page extends Component<IPageView> {
  protected _counter: HTMLElement;
  protected _basketButton: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this._counter = ensureElement(".header__basket-counter", container);
    this._basketButton = ensureElement(
      ".header__basket",
      container,
    ) as HTMLButtonElement;

    this._basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set counter(value: number) {
    this._counter.textContent = String(value);
  }
}
