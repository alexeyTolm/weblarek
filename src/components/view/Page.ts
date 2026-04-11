import { Component } from "../base/Component";

export interface IPageView {
  counter: number;
  items: HTMLElement[];
}

export class Page extends Component<IPageView> {
  protected _counter: HTMLElement;
  protected _gallery: HTMLElement;
  protected _basketButton: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._counter = container.querySelector(".header__basket-counter")!;
    this._gallery = container.querySelector(".gallery")!;
    this._basketButton = container.querySelector(".header__basket")!;
  }

  set counter(value: number) {
    if (this._counter) this._counter.textContent = String(value);
  }

  set items(items: HTMLElement[]) {
    if (this._gallery) {
      this._gallery.innerHTML = "";
      items.forEach((item) => this._gallery.appendChild(item));
    }
  }

  onBasketClick(callback: () => void) {
    if (this._basketButton) {
      this._basketButton.addEventListener("click", callback);
    }
  }

  render(data: IPageView): HTMLElement {
    this.counter = data.counter;
    this.items = data.items;
    return this.container;
  }
}
