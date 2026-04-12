import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IPageView {
  counter: number;
  items: HTMLElement[];
}

export class Page extends Component<IPageView> {
  protected _counter: HTMLElement;
  protected _gallery: HTMLElement;
  protected _basketButton: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this._counter = container.querySelector(".header__basket-counter")!;
    this._gallery = container.querySelector(".gallery")!;
    this._basketButton = container.querySelector(".header__basket")!;

    if (this._basketButton) {
      this._basketButton.addEventListener("click", () => {
        this.events.emit("basket:open");
      });
    }
  }

  set counter(value: number) {
    if (this._counter) this._counter.textContent = String(value);
  }

  set items(items: HTMLElement[]) {
    if (this._gallery) {
      this._gallery.replaceChildren(...items);
    }
  }
}
