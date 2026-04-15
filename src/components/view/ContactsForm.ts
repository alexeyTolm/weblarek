import { FormBase } from "./base/FormBase";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IContactsFormData {
  email: string;
  phone: string;
}

export class ContactsForm extends FormBase<IContactsFormData> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;
  protected events: IEvents;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);
    this.events = events;
    this._emailInput = ensureElement(
      'input[name="email"]',
      container,
    ) as HTMLInputElement;
    this._phoneInput = ensureElement(
      'input[name="phone"]',
      container,
    ) as HTMLInputElement;
  }

  protected onInputChange() {
    this.events.emit("contacts:emailChanged", {
      email: this._emailInput.value,
    });
    this.events.emit("contacts:phoneChanged", {
      phone: this._phoneInput.value,
    });
  }

  set email(value: string) {
    if (this._emailInput.value !== value) {
      this._emailInput.value = value;
    }
  }

  set phone(value: string) {
    if (this._phoneInput.value !== value) {
      this._phoneInput.value = value;
    }
  }

  protected onSubmit() {
    this.events.emit("contacts:submit");
  }
}
