import { INITIAL_STATE_TEMPTODO } from '../constants/initial_state_newTodo';
import { ReducerType } from '../enums/Reducer';
import { Todo } from '../types/Todo';

export const reducer = (
  tempTodo: Todo,
  action: { type: ReducerType, newTitle: string },
) => {
  switch (action.type) {
    case ReducerType.RESET:
      return INITIAL_STATE_TEMPTODO;
    case ReducerType.TITLE:
      return { ...tempTodo, title: action.newTitle };
    case ReducerType.ID:
      return { ...tempTodo, id: +new Date() };
    default:
      return { ...tempTodo };
  }
};
