import { CardBase, ICardActions } from "./base/CardBase";
import { IProduct } from "../../types";
import { categoryMap } from "../../utils/constants";

export class CardPreview extends CardBase {
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
    this._category = container.querySelector(".card__category")!;
    this._image = container.querySelector(".card__image")!;
    this._description = container.querySelector(".card__text")!;
    this._button = container.querySelector(".card__button")!;

    // Устанавливаем слушатель на кнопку
    if (this._button) {
      this._button.addEventListener("click", (e) => {
        e.stopPropagation();
        if (actions?.onClick) {
          actions.onClick(e);
        }
      });
    }
  }

  set category(value: string) {
    if (this._category && value) {
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
    if (this._image && value) {
      this._image.src = value;
      this._image.alt = this._title?.textContent || "Товар";
    }
  }

  set description(value: string) {
    if (this._description) this._description.textContent = value;
  }

  set buttonText(value: string) {
    if (this._button) {
      this._button.textContent = value;
    }
  }

  set buttonDisabled(value: boolean) {
    if (this._button) {
      this._button.disabled = value;
    }
  }

  render(
    product: IProduct & { buttonText?: string; buttonDisabled?: boolean },
  ): HTMLElement {
    this.title = product.title;
    this.price = product.price;
    this.category = product.category;
    this.image = product.image;
    this.description = product.description;
    if (product.buttonText !== undefined) {
      this.buttonText = product.buttonText;
    }
    if (product.buttonDisabled !== undefined) {
      this.buttonDisabled = product.buttonDisabled;
    }
    return this.container;
  }
}
