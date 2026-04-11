import { CardBase, ICardActions } from "./base/CardBase";
import { IProduct } from "../../types";

export class CardCatalog extends CardBase {
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
  }

  set data(product: IProduct) {
    this.title = product.title;
    this.price = product.price;
    this.category = product.category;
    this.image = product.image;
  }

  render(product: IProduct): HTMLElement {
    this.data = product;
    return this.container;
  }
}
