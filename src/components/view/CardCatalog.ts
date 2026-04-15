import { CardBase, ICardActions } from "./base/CardBase";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";

export interface ICardCatalog {
  title: string;
  price: number | null;
  category: string;
  image: string;
}

export class CardCatalog extends CardBase<ICardCatalog> {
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
    this._category = ensureElement(".card__category", container);
    this._image = ensureElement(".card__image", container) as HTMLImageElement;
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
}
