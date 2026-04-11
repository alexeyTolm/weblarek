import { CardBase, ICardActions } from "./base/CardBase";
import { IProduct } from "../../types";

export class CardBasket extends CardBase {
  protected _index: HTMLElement;
  protected _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
    this._index = container.querySelector(".basket__item-index")!;
    this._deleteButton = container.querySelector(".basket__item-delete")!;

    this._deleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      actions?.onClick?.(e);
    });
  }

  set index(value: number) {
    if (this._index) this._index.textContent = String(value);
  }

  set data(product: IProduct & { index: number }) {
    this.title = product.title;
    this.price = product.price;
    this.index = product.index;
  }

  render(product: IProduct & { index: number }): HTMLElement {
    this.data = product;
    return this.container;
  }
}
