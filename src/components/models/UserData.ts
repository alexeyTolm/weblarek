import { IBuyer,TPayment } from "../../types";

export class UserData {
  private payment: TPayment | "" = "";
  private address: string = "";
  private email: string = "";
  private phone: string = "";

  constructor() {
    this.payment = "";
    this.address = "";
    this.email = "";
    this.phone = "";
  }

  setUserData(field: keyof IBuyer, value: string): void {
    if (field === "payment") {
      this.payment = value as TPayment;
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

  validateUserData() {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this.payment) errors.payment = "Не выбран вид оплаты";
    if (!this.address) errors.address = "Укажите адрес";
    if (!this.email) errors.email = "Укажите email";
    if (!this.phone) errors.phone = "Укажите телефон";

    return errors;
  }
}