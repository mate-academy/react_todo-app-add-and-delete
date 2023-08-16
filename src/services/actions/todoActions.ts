import { TodoActions, Types } from '../../reducer';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../utils/const';

export const setTodosToStateAction = (todos: Todo[]):TodoActions => {
  return {
    type: Types.SetTodosToState,
    payload: {
      todos,
    },
  };
};

export const createTodoAction = (id: number, title:string): TodoActions => {
  return {
    type: Types.Create,
    payload: {
      id,
      userId: USER_ID,
      title,
      completed: false,
    },
  };
};

export const editTodoAction = (todoToEdit:Todo, id?:number):TodoActions => {
  const action:TodoActions = {
    type: Types.Edit,
    payload: {
      todoToEdit,
      id,
    },
  };

  if (id) {
    action.payload.id = id;
  }

  return action;
};

export const deleteTodoAction = (id: number): TodoActions => {
  return {
    type: Types.Delete,
    payload: {
      id,
    },
  };
};

export const toggleTodoCompletedAction = (id: number): TodoActions => {
  return {
    type: Types.ToggleCompleted,
    payload: {
      id,
    },
  };
};
