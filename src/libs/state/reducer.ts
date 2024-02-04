import { Actions } from '../enums';
import { Action, State } from '../types';

export function reducer(state:State, action:Action):State {
  switch (action.type) {
    case Actions.load: {
      const { todos } = action.payload;

      return { ...state, todos };
    }

    case Actions.addTempTodo: {
      const { todo } = action.payload;

      return {
        ...state,
        tempTodo: todo,
      };
    }

    case Actions.add: {
      const { todo } = action.payload;

      return {
        ...state,
        todos: [...state.todos, todo],
      };
    }

    case Actions.delete: {
      const { todoId } = action.payload;

      return {
        ...state,
        todos: state.todos.filter(({ id }) => id !== todoId),
      };
    }

    case Actions.update: {
      const { todo } = action.payload;

      const updatedTodos = state.todos.map(existingTodo => (
        (existingTodo.id === todo.id) ? todo : existingTodo
      ));

      return {
        ...state,
        todos: updatedTodos,
      };
    }

    case Actions.toggleAll: {
      const { isCompleted } = action.payload;

      const updatedTodos = state.todos.map(todo => (
        { ...todo, completed: isCompleted }
      ));

      return {
        ...state,
        todos: updatedTodos,
      };
    }

    case Actions.clearCompleted:
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed),
      };

    case Actions.setErrorMessage: {
      const { errorMessage } = action.payload;

      return { ...state, errorMessage };
    }

    case Actions.setLoader: {
      const { isLoading, todoIds } = action.payload;

      if (isLoading && todoIds) {
        return {
          ...state,
          loader: { isLoading, todoIds },
        };
      }

      return {
        ...state,
        loader: { isLoading, todoIds: [] },
      };
    }

    default:
      return state;
  }
}
