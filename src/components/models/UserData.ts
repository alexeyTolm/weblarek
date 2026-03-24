import { IBuyer,TPayment } from "../../types";
import { TFormErrors } from "../../types";

export class UserData {
  private payment: TPayment | "" = "";
  private address: string = "";
  private email: string = "";
  private phone: string = "";

  constructor() {}

  setUserData(field: keyof IBuyer, value: string): void {
    if (field === "payment") {
      if (value === "online" || value === "offline") {
        this.payment = value;
      } else {
        console.warn(`Попытка установить неверный тип оплаты: ${value}`);
      }
    } else {
      this[field] = value;
    }
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