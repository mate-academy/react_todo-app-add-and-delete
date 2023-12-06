import { Action } from '../types/Action';
import { State } from '../types/State';

export const reduser = (state: State, action: Action): State => {
  switch (action.type) {
    case 'loadingTodos':
      return {
        ...state,
        todos: action.payload,
      };

    case 'error':
      return {
        ...state,
        errorMessage: action.payload,
      };

    case 'filter':
      return {
        ...state,
        filteredBy: action.payload,
      };

    case 'updateTodo': {
      const { todos } = state;
      const { completed, id, title } = action.payload;

      if (todos) {
        const updatedTodo = todos.find(
          todo => todo.id === id,
        );

        if (updatedTodo) {
          updatedTodo.completed = completed;
          updatedTodo.title = title;
        }

        return {
          ...state,
          todos: [...todos],
        };
      }

      return state;
    }

    case 'createTempTodo': {
      return {
        ...state,
        tempTodo: action.payload,
      };
    }

    case 'createTodo': {
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    }

    case 'deleteTodo': {
      const updatedTodos = state.todos.filter(
        todo => todo.id !== action.payload,
      );

      return {
        ...state,
        todos: updatedTodos,
      };
    }

    case 'deleteCompletedTodos': {
      return {
        ...state,
        deleteCompleted: true,
      };
    }

    default:
      return state;
  }
};
