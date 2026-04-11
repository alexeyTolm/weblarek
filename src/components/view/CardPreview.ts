import { CardBase, ICardActions } from "./base/CardBase";
import { IProduct } from "../../types";

export class CardPreview extends CardBase {
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
    this._description = container.querySelector(".card__text")!;
  }

  set description(value: string) {
    if (this._description) this._description.textContent = value;
  }

  set inBasket(value: boolean) {
    if (this._button) {
      this._button.textContent = value ? "Убрать из корзины" : "В корзину";
    }
  }

  set data(product: IProduct & { inBasket?: boolean }) {
    this.title = product.title;
    this.price = product.price;
    this.category = product.category;
    this.image = product.image;
    this.description = product.description;
    if (product.inBasket !== undefined) {
      this.inBasket = product.inBasket;
    }
  }

  set price(value: number | null) {
    super.price = value;
    if (this._button && value === null) {
      this._button.disabled = true;
      this._button.textContent = "Недоступно";
    }
  }

  render(product: IProduct & { inBasket?: boolean }): HTMLElement {
    this.data = product;
    return this.container;
  }
}
