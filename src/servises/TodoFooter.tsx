import * as buttonsServises from './buttons';
import { ButtonProp } from '../types/ButtonType';
import { Todo } from '../types/Todo';
import { ButtonName } from '../enums/ButtonsEnum';

export const filteredButtons: ButtonProp[] = buttonsServises.getButtons();

export const filter = (listOfTodos: Todo[], query: ButtonName) => {
  switch (query) {
    case ButtonName.ACTIVE:
      return listOfTodos.filter(item => !item.completed);
    case ButtonName.COMPLETED:
      return listOfTodos.filter(item => item.completed);
    default:
      return listOfTodos;
  }
};
