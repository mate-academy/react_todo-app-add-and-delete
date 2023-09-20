import { TodosListType } from '../types/todosTypes';
import { Actions } from '../types/actionTypes';

export const todosReducer
= (todos: TodosListType, action: Actions): TodosListType => {
  const { type, payload } = action;

  switch (type) {
    case 'LOAD': {
      return [...payload];
    }

    case 'ADD': {
      return [...todos, payload];
    }

    default: {
      throw Error('Unknown action');
    }
  }
};
