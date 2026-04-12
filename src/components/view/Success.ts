import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface ISuccessData {
  total: number;
}

export class Success extends Component<ISuccessData> {
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this._description = container.querySelector(".order-success__description")!;
    this._button = container.querySelector(".order-success__close")!;

    if (this._button) {
      this._button.addEventListener("click", () => {
        this.events.emit("success:close");
      });
    }
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
