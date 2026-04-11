import { FormBase } from "./base/FormBase";

export interface IContactsFormData {
  email: string;
  phone: string;
}

export class ContactsForm extends FormBase<IContactsFormData> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement) {
    super(container);
    this._emailInput = container.querySelector('input[name="email"]')!;
    this._phoneInput = container.querySelector('input[name="phone"]')!;

    this._emailInput.addEventListener("input", () => this.onInputChange());
    this._phoneInput.addEventListener("input", () => this.onInputChange());
  }

  protected onInputChange() {
    const data: IContactsFormData = {
      email: this._emailInput.value || "",
      phone: this._phoneInput.value || "",
    };
    this.container.dispatchEvent(new CustomEvent("change", { detail: data }));
  }

  protected onSubmit() {
    this.container.dispatchEvent(new CustomEvent("submit"));
  }

  getData(): IContactsFormData {
    return {
      email: this._emailInput.value || "",
      phone: this._phoneInput.value || "",
    };
  }

  set valid(value: boolean) {
    super.valid = value;
  }
}
