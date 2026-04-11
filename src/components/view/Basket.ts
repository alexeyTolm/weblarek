import { Component } from "../base/Component";

export interface IBasketView {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasketView> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    this._list = container.querySelector(".basket__list")!;
    this._total = container.querySelector(".basket__price")!;
    this._button = container.querySelector(".basket__button")!;
  }

  set items(items: HTMLElement[]) {
    if (this._list) {
      this._list.innerHTML = "";
      if (items.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "Корзина пуста";
        emptyMessage.style.textAlign = "center";
        emptyMessage.style.padding = "20px";
        this._list.appendChild(emptyMessage);
      } else {
        items.forEach((item) => this._list.appendChild(item));
      }
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

  onCheckout(callback: () => void) {
    if (this._button) {
      this._button.addEventListener("click", callback);
    }
  }

  render(data: IBasketView): HTMLElement {
    this.items = data.items;
    this.total = data.total;
    this.disabled = data.items.length === 0;
    return this.container;
  }
}
