import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class Modal extends Component<{ content: HTMLElement }> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;
  protected _container: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this._closeButton = ensureElement(
      ".modal__close",
      container,
    ) as HTMLButtonElement;
    this._content = ensureElement(".modal__content", container);
    this._container = container;

    this._closeButton.addEventListener("click", this.close.bind(this));
    this._container.addEventListener("click", this.close.bind(this));
    this._content.addEventListener("click", (e) => e.stopPropagation());
  }

  set content(value: HTMLElement) {
    this._content.innerHTML = "";
    this._content.appendChild(value);
  }

  open() {
    this._container.classList.add("modal_active");
  }

  close() {
    this._container.classList.remove("modal_active");
    this._content.innerHTML = "";
  }

  render(data: { content: HTMLElement }): HTMLElement {
    this.content = data.content;
    this.open();
    return this._container;
  }
}
