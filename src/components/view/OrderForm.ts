import { FormBase } from "./base/FormBase";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IOrderFormData {
  payment: string;
  address: string;
}

export class OrderForm extends FormBase<IOrderFormData> {
  protected _cardButton: HTMLButtonElement;
  protected _cashButton: HTMLButtonElement;
  protected _addressInput: HTMLInputElement;
  protected events: IEvents;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);
    this.events = events;
    this._cardButton = ensureElement(
      'button[name="card"]',
      container,
    ) as HTMLButtonElement;
    this._cashButton = ensureElement(
      'button[name="cash"]',
      container,
    ) as HTMLButtonElement;
    this._addressInput = ensureElement(
      'input[name="address"]',
      container,
    ) as HTMLInputElement;

    this._cardButton.addEventListener("click", () => {
      this.events.emit("order:paymentSelected", { payment: "online" });
    });

    this._cashButton.addEventListener("click", () => {
      this.events.emit("order:paymentSelected", { payment: "offline" });
    });
  }

  protected onInputChange() {
    this.events.emit("order:addressChanged", {
      address: this._addressInput.value,
    });
  }

  set payment(value: string) {
    if (value === "online") {
      this._cardButton.classList.add("button_alt-active");
      this._cashButton.classList.remove("button_alt-active");
    } else if (value === "offline") {
      this._cashButton.classList.add("button_alt-active");
      this._cardButton.classList.remove("button_alt-active");
    } else {
      this._cardButton.classList.remove("button_alt-active");
      this._cashButton.classList.remove("button_alt-active");
    }
  }

  set address(value: string) {
    this._addressInput.value = value;
  }

  protected onSubmit() {
    this.events.emit("order:submit");
  }
}
