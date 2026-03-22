import { IBuyer,TPayment } from "../../types";

export class UserData {
  payment: TPayment | string = "";
  address: string = "";
  email: string = "";
  phone: string = "";
  formErrors: Partial<Record<keyof IBuyer, string>> = {};

  constructor() {}

  setUserData(field: keyof IBuyer, value: string): void {
    if (field === "payment") {
      this.payment = value as TPayment;
    } else {
      this[field] = value;
    }
    this.validateUserData();
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
    this.formErrors = {};
  }

  validateUserData(): boolean {
    const errors: typeof this.formErrors = {};

    if (!this.payment) errors.payment = "Не выбран вид оплаты";
    if (!this.address) errors.address = "Укажите адрес";
    if (!this.email) errors.email = "Укажите email";
    if (!this.phone) errors.phone = "Укажите телефон";

    this.formErrors = errors;
    return Object.keys(errors).length === 0;
  }
}