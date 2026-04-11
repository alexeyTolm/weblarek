import { Component } from "../../base/Component";
import { IProduct } from "../../../types";
import { categoryMap } from "../../../utils/constants";

export interface ICardActions {
  onClick?: (event: MouseEvent) => void;
}

export class CardBase extends Component<IProduct> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _category?: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _button?: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._title = container.querySelector(".card__title")!;
    this._price = container.querySelector(".card__price")!;
    this._category = container.querySelector(".card__category") || undefined;
    this._image = container.querySelector(".card__image") || undefined;
    this._button = container.querySelector(".card__button") || undefined;

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener("click", actions.onClick);
      } else {
        container.addEventListener("click", actions.onClick);
      }
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

  set category(value: string) {
    if (this._category && value) {
      this._category.textContent = value;

      Object.values(categoryMap).forEach((modifier) => {
        this._category?.classList.remove(modifier);
      });

      const modifier = categoryMap[value as keyof typeof categoryMap];
      if (modifier) {
        this._category.classList.add(modifier);
      }
    }
  }

  set image(value: string) {
    if (this._image && value) {
      this._image.src = value;
      this._image.alt = this._title?.textContent || "Товар";
    }
  }
}
