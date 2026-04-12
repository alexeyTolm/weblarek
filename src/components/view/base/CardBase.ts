import { Component } from "../../base/Component";
import { IProduct } from "../../../types";

export interface ICardActions {
  onClick?: (event: MouseEvent) => void;
}

export class CardBase extends Component<IProduct> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._title = container.querySelector(".card__title")!;
    this._price = container.querySelector(".card__price")!;

    if (actions?.onClick) {
      container.addEventListener("click", actions.onClick);
    }
  }

  set title(value: string) {
    if (this._title) this._title.textContent = value;
  }

  set price(value: number | null) {
    if (this._price) {
      if (value === null) {
        this._price.textContent = "Бесценно";
      } else {
        this._price.textContent = `${value} синапсов`;
      }
    }
  }
}
