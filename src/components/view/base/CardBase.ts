import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

export interface ICardActions {
  onClick?: (event: MouseEvent) => void;
}

export interface ICardBase {
  title: string;
  price: number | null;
}

export class CardBase<T extends ICardBase = ICardBase> extends Component<T> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._title = ensureElement(".card__title", container);
    this._price = ensureElement(".card__price", container);

    if (actions?.onClick) {
      container.addEventListener("click", actions.onClick);
    }
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set price(value: number | null) {
    if (value === null) {
      this._price.textContent = "Бесценно";
    } else {
      this._price.textContent = `${value} синапсов`;
    }
  }
}
