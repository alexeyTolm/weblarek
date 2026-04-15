import { CardBase, ICardActions } from "./base/CardBase";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";

export interface ICardPreview {
  title: string;
  price: number | null;
  category: string;
  image: string;
  description: string;
  buttonText: string;
  buttonDisabled: boolean;
}

export class CardPreview extends CardBase<ICardPreview> {
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
    this._category = ensureElement(".card__category", container);
    this._image = ensureElement(".card__image", container) as HTMLImageElement;
    this._description = ensureElement(".card__text", container);
    this._button = ensureElement(
      ".card__button",
      container,
    ) as HTMLButtonElement;

    this._button.addEventListener("click", (e) => {
      e.stopPropagation();
      if (actions?.onClick) {
        actions.onClick(e);
      }
    });
  }

  set category(value: string) {
    if (value) {
      this._category.textContent = value;

      Object.values(categoryMap).forEach((modifier) => {
        this._category.classList.remove(modifier);
      });

      const modifier = categoryMap[value as keyof typeof categoryMap];
      if (modifier) {
        this._category.classList.add(modifier);
      }
    }
  }

  set image(value: string) {
    if (value) {
      this._image.src = value;
      this._image.alt = this._title?.textContent || "Товар";
    }
  }

  set description(value: string) {
    this._description.textContent = value;
  }

  set buttonText(value: string) {
    this._button.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this._button.disabled = value;
  }

}
