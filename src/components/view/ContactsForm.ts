import { FormBase } from "./base/FormBase";
import { IEvents } from "../base/Events";

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
    this._emailInput = container.querySelector('input[name="email"]')!;
    this._phoneInput = container.querySelector('input[name="phone"]')!;
    
    this._emailInput.addEventListener("input", () => {
      this.events.emit("contacts:emailChanged", {
        email: this._emailInput.value,
      });
    });

    this._phoneInput.addEventListener("input", () => {
      this.events.emit("contacts:phoneChanged", {
        phone: this._phoneInput.value,
      });
    });
  }

  set email(value: string) {
    if (this._emailInput) {
      this._emailInput.value = value;
    }
  }

  // Сеттер для телефона - только отображаем данные из модели
  set phone(value: string) {
    if (this._phoneInput) {
      this._phoneInput.value = value;
    }
  }

  set errors(value: string) {
    if (this._errorsContainer) {
      this._errorsContainer.textContent = value;
    }
  }

  protected onSubmit() {
    this.events.emit("contacts:submit");
  }
}
