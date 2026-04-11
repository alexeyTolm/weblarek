import { Component } from "../../base/Component";

export interface IFormState {
  valid: boolean;
  errors: string[];
}

export class FormBase<T> extends Component<T> {
  protected _form: HTMLFormElement;
  protected _submitButton: HTMLButtonElement;
  protected _errorsContainer: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._form = container as HTMLFormElement;
    this._submitButton = container.querySelector('.button[type="submit"]')!;
    this._errorsContainer = container.querySelector(".form__errors")!;

    this._form.addEventListener("input", () => {
      this.onInputChange();
    });

    this._form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.onSubmit();
    });
  }

  protected onInputChange(): void {

  }

  protected onSubmit(): void {

  }

  set valid(value: boolean) {
    if (this._submitButton) {
      this._submitButton.disabled = !value;
    }
  }

  set errors(value: string) {
    if (this._errorsContainer) {
      this._errorsContainer.textContent = value;
    }
  }

  render(state?: Partial<T> & IFormState): HTMLElement {
    if (state) {
      this.valid = state.valid ?? true;
      this.errors = state.errors?.join(", ") || "";
    }
    return super.render(state);
  }
}
