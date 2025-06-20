/* eslint-disable @typescript-eslint/lines-between-class-members */
import { ButtonProp } from '../types/ButtonType';
import { ButtonName } from '../enums/ButtonsEnum';

export const FILTERED_BUTTONS_NAME: ButtonName[] = Object.values(ButtonName);

export class Button {
  name: string;
  className: string;
  key: string;
  href: string;
  dataCy: string;

  constructor(name: string, className = 'filter__link', key = name) {
    this.name = name[0].toUpperCase() + name.slice(1);
    this.className = className;
    this.key = key;
    this.href = this.makehref();
    this.dataCy = this.makedataCy();
  }

  makehref() {
    return this.name === 'all'
      ? '#/'
      : `#/${this.name[0].toLowerCase() + this.name.slice(1)}`;
  }

  makedataCy() {
    const init = 'FilterLink';

    return `${init}${this.name}`;
  }
}

export const getButtons = () => {
  const FILTERED_BUTTONS: ButtonProp[] = [];

  FILTERED_BUTTONS_NAME.forEach(button => {
    const newButton = new Button(button);

    FILTERED_BUTTONS.push(newButton);
  });

  return FILTERED_BUTTONS;
};
