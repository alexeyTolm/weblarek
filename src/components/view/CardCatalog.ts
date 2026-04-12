import { CardBase, ICardActions } from "./base/CardBase";
import { IProduct } from "../../types";
import { categoryMap } from "../../utils/constants";

export class CardCatalog extends CardBase {
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
    this._category = container.querySelector(".card__category")!;
    this._image = container.querySelector(".card__image")!;
  }

  set category(value: string) {
    if (this._category && value) {
      this._category.textContent = value;

      // Удаляем все существующие модификаторы категорий
      Object.values(categoryMap).forEach((modifier) => {
        this._category.classList.remove(modifier);
      });

      // Добавляем новый модификатор
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

  render(product: IProduct): HTMLElement {
    this.title = product.title;
    this.price = product.price;
    this.category = product.category;
    this.image = product.image;
    return this.container;
  }
}
