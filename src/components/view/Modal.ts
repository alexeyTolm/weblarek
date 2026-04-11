import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Modal extends Component<{ content: HTMLElement }> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;
  protected _container: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this._closeButton = container.querySelector(".modal__close")!;
    this._content = container.querySelector(".modal__content")!;
    this._container = container;

    this._closeButton.addEventListener("click", this.close.bind(this));
    this._container.addEventListener("click", this.close.bind(this));
    this._content.addEventListener("click", (e) => e.stopPropagation());
  }

  set content(value: HTMLElement) {
    if (this._content) {
      this._content.innerHTML = "";
      this._content.appendChild(value);
    }
  }

  open() {
    this._container.classList.add("modal_active");
    this.events.emit("modal:open");
  }

  close() {
    this._container.classList.remove("modal_active");
    this._content.innerHTML = "";
    this.events.emit("modal:close");
  }

  render(data: { content: HTMLElement }): HTMLElement {
    this.content = data.content;
    this.open();
    return this._container;
  }
}
