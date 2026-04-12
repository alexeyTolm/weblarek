import { FormBase } from "./base/FormBase";
import { IEvents } from "../base/Events";

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
    this._cardButton = container.querySelector('button[name="card"]')!;
    this._cashButton = container.querySelector('button[name="cash"]')!;
    this._addressInput = container.querySelector('input[name="address"]')!;

    this._cardButton.addEventListener("click", () => {
      this.events.emit("order:paymentSelected", { payment: "online" });
    });

    this._cashButton.addEventListener("click", () => {
      this.events.emit("order:paymentSelected", { payment: "offline" });
    });

    this._addressInput.addEventListener("input", () => {
      this.events.emit("order:addressChanged", {
        address: this._addressInput.value,
      });
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
    if (this._addressInput) {
      this._addressInput.value = value;
    }
  }

  set errors(value: string) {
    if (this._errorsContainer) {
      this._errorsContainer.textContent = value;
    }
  }

  protected onSubmit() {
    this.events.emit("order:submit");
  }
}
