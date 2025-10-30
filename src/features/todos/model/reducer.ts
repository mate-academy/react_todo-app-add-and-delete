import { ACTIONS, Action } from './actions';
import { FILTER, Filter, Todo } from './types';

export type TodosState = {
  todos: Todo[];
  tempTodo: Todo | null;
  filter: Filter;
  isLoading: boolean;
  isError: boolean;
};

export const initialState: TodosState = {
  todos: [],
  tempTodo: null,
  filter: FILTER.ALL,
  isLoading: false,
  isError: false,
};

export const todosReducer = (state: TodosState, action: Action): TodosState => {
  const { todos } = state;

  switch (action.type) {
    case ACTIONS.SET_TODOS:
      return { ...state, todos: action.payload };

    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ACTIONS.SET_ERROR:
      return { ...state, isError: action.payload, isLoading: false };

    case ACTIONS.SET_TEMP_TODO:
      return { ...state, tempTodo: action.payload };

    case ACTIONS.ADD_TODO:
      return { ...state, todos: [...todos, action.payload] };

    case ACTIONS.RENAME_TODO: {
      const { id, title } = action.payload;

      return {
        ...state,
        todos: todos.map(t => (t.id === id ? { ...t, title } : t)),
      };
    }

    case ACTIONS.DELETE_TODO:
      return {
        ...state,
        todos: todos.filter(t => t.id !== action.payload.id),
      };

    case ACTIONS.TOGGLE_TODO: {
      const { id } = action.payload;

      return {
        ...state,
        todos: todos.map(t =>
          t.id === id ? { ...t, completed: !t.completed } : t,
        ),
      };
    }

    case ACTIONS.TOGGLE_ALL: {
      const allCompleted = todos.every(t => t.completed);

      return {
        ...state,
        todos: todos.map(t => ({ ...t, completed: !allCompleted })),
      };
    }

    case ACTIONS.SET_FILTER:
      return { ...state, filter: action.payload };

    default:
      return state;
  }
};
