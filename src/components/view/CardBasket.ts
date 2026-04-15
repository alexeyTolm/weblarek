import { CardBase, ICardActions } from "./base/CardBase";
import { ensureElement } from "../../utils/utils";

export interface ICardBasket {
  title: string;
  price: number | null;
  index: number;
}

export class CardBasket extends CardBase<ICardBasket> {
  protected _index: HTMLElement;
  protected _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
    this._index = ensureElement(".basket__item-index", container);
    this._deleteButton = ensureElement(
      ".basket__item-delete",
      container,
    ) as HTMLButtonElement;

    this._deleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      actions?.onClick?.(e);
    });
  }

  set index(value: number) {
    this._index.textContent = String(value);
  }
}
