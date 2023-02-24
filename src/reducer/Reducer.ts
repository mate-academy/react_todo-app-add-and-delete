import { INITIAL_STATE_TEMPTODO } from '../constants/initial_state_newTodo';
import { Todo } from '../types/Todo';

export const reducer = (tempTodo: Todo, action: any) => {
  switch (action.type) {
    case 'reset':
      return INITIAL_STATE_TEMPTODO;
    case 'title':
      return { ...tempTodo, title: action.newTitle };
    case 'id':
      return { ...tempTodo, id: +new Date() };
    default:
      return { ...tempTodo };
  }
};
