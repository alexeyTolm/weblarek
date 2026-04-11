import { Component } from "../base/Component";

export interface ISuccessData {
  total: number;
}

export class Success extends Component<ISuccessData> {
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, onClose: () => void) {
    super(container);
    this._description = container.querySelector(".order-success__description")!;
    this._button = container.querySelector(".order-success__close")!;

    this._button.addEventListener("click", onClose);
  }

  set total(value: number) {
    if (this._description) {
      this._description.textContent = `Списано ${value} синапсов`;
    }
  }

  render(data: ISuccessData): HTMLElement {
    this.total = data.total;
    return this.container;
  }
}
