import { CardBase, ICardBase } from "./base/CardBase";
import { ensureElement } from "../../utils/utils";

export interface ICardBasket extends ICardBase {
  index: number;
}

export class CardBasket extends CardBase<ICardBasket> {
  protected _index: HTMLElement;
  protected _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, onDelete?: () => void) {
    super(container);
    this._index = ensureElement(".basket__item-index", container);
    this._deleteButton = ensureElement(
      ".basket__item-delete",
      container,
    ) as HTMLButtonElement;

    if (onDelete) {
      this._deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        onDelete();
      });
    }
  }

  set index(value: number) {
    this._index.textContent = String(value);
  }
}
