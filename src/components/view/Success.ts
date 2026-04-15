import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

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
    this._description = ensureElement(".order-success__description", container);
    this._button = ensureElement(
      ".order-success__close",
      container,
    ) as HTMLButtonElement;

    this._button.addEventListener("click", () => {
      this.events.emit("success:close");
    });
  }

  set total(value: number) {
    this._description.textContent = `Списано ${value} синапсов`;
  }

  render(data?: ISuccessData): HTMLElement {
    if (data) {
      this.total = data.total;
    }
    return this.container;
  }
}
