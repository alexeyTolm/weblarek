import { IBuyer, TPayment } from "../../types";
import { TFormErrors } from "../../types";
import { IEvents } from "../base/Events";

export class UserData {
  private payment: TPayment | "" = "";
  private address: string = "";
  private email: string = "";
  private phone: string = "";
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  setUserData(field: keyof IBuyer, value: string): void {
    if (field === "payment") {
      if (value === "online" || value === "offline") {
        this.payment = value;
      }
    } else {
      (this as any)[field] = value;
    }
    this.events.emit("user:changed", this.getUserData());
  }

  getUserData(): IBuyer {
    return {
      payment: this.payment as TPayment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  clearUserData(): void {
    this.payment = "";
    this.address = "";
    this.email = "";
    this.phone = "";
    this.events.emit("user:changed", this.getUserData());
  }

  validateUserData(): TFormErrors {
    const errors: TFormErrors = {};

    if (!this.payment) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this.address) {
      errors.address = "Необходимо указать адрес";
    }
    if (!this.email) {
      errors.email = "Необходимо указать email";
    }
    if (!this.phone) {
      errors.phone = "Необходимо указать телефон";
    }

    return errors;
  }
}
