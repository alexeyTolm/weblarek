import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface IGalleryView {
  items: HTMLElement[];
}

export class Gallery extends Component<IGalleryView> {
  protected _gallery: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._gallery = ensureElement(".gallery", container);
  }

  set items(items: HTMLElement[]) {
    this._gallery.replaceChildren(...items);
  }
}
