import { FormBase } from "./base/FormBase";

export interface IOrderFormData {
  payment: string;
  address: string;
}

export class OrderForm extends FormBase<IOrderFormData> {
  protected _cardButton: HTMLButtonElement;
  protected _cashButton: HTMLButtonElement;
  protected _addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement) {
    super(container);
    this._cardButton = container.querySelector('button[name="card"]')!;
    this._cashButton = container.querySelector('button[name="cash"]')!;
    this._addressInput = container.querySelector('input[name="address"]')!;

    this._cardButton.addEventListener("click", () => this.setPayment("online"));
    this._cashButton.addEventListener("click", () =>
      this.setPayment("offline"),
    );
    this._addressInput.addEventListener("input", () => this.onInputChange());
  }

  protected setPayment(type: "online" | "offline") {
    this._cardButton.classList.toggle("button_alt-active", type === "online");
    this._cashButton.classList.toggle("button_alt-active", type === "offline");
    this.emitChange();
  }

  protected onInputChange() {
    this.emitChange();
  }

  protected emitChange() {
    const data: IOrderFormData = {
      payment: this._cardButton.classList.contains("button_alt-active")
        ? "online"
        : this._cashButton.classList.contains("button_alt-active")
          ? "offline"
          : "",
      address: this._addressInput.value || "",
    };
    this.container.dispatchEvent(new CustomEvent("change", { detail: data }));
  }

  protected onSubmit() {
    this.container.dispatchEvent(new CustomEvent("submit"));
  }

  getData(): IOrderFormData {
    return {
      payment: this._cardButton.classList.contains("button_alt-active")
        ? "online"
        : this._cashButton.classList.contains("button_alt-active")
          ? "offline"
          : "",
      address: this._addressInput.value || "",
    };
  }

  set valid(value: boolean) {
    super.valid = value;
  }
}
