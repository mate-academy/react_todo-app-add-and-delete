import React, { useReducer } from 'react';
import { Todo } from '../types/Todo';
import { SortingTodos } from '../types/Sorting';

interface State {
  todos: Todo[];
  tab: SortingTodos;
  error: string;
  isLoadingItems: { [key: number]: boolean };
  isLoading: boolean;
}

type Action =
  | { type: 'updateTodo'; payload: { updatedTodo: Todo } }
  | { type: 'updateTodoId'; payload: { temporaryId: number; serverId: number } }
  | { type: 'deleteTodo'; payload: { id: number } }
  | { type: 'addTodo'; payload: { newTodo: Todo } }
  | { type: 'addTempTodo'; payload: { tempTodo: Todo } }
  | { type: 'setTodos'; payload: Todo[] }
  | { type: 'clearCompleted' }
  | { type: 'activeTab'; payload: { tab: SortingTodos } }
  | { type: 'setError'; payload: { errorMessage: string } }
  | { type: 'clearError' }
  | { type: 'setLoading'; payload: { isLoading: boolean } }
  | { type: 'setItemLoading'; payload: { id: number; isLoading: boolean } }
  | { type: 'setAdding'; payload: { isAdded: boolean } }
  | { type: 'toggleAll'; payload: { updatedTodos: Todo[] } };

const initialState: State = {
  todos: [],
  tab: SortingTodos.all,
  error: '',
  isLoadingItems: {},
  isLoading: false,
};

const deleteTodo = (state: State, id: number): State => {
  return {
    ...state,
    todos: state.todos.filter(todo => todo.id !== id),
  };
};

const updateTodo = (state: State, updatedTodo: Todo): State => {
  return {
    ...state,
    todos: state.todos.map(todo =>
      todo.id === updatedTodo.id ? updatedTodo : todo,
    ),
  };
};

const clearCompleted = (state: State) => {
  return {
    ...state,
    todos: state.todos.filter(todo => !todo.completed),
  };
};

const activeTab = (state: State, tab: SortingTodos): State => {
  return {
    ...state,
    tab: tab,
  };
};

const toggleAll = (state: State, updatedTodos: Todo[]): State => {
  return {
    ...state,
    todos: state.todos.map(
      todo =>
        updatedTodos.find(updatedTodo => updatedTodo.id === todo.id) || todo,
    ),
  };
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setTodos': {
      return {
        ...state,
        todos: action.payload,
      };
    }

    case 'addTodo': {
      return {
        ...state,
        todos: [
          ...state.todos.filter(todo => !todo.isLoading),
          action.payload.newTodo,
        ],
      };
    }

    case 'addTempTodo': {
      return {
        ...state,
        todos: [...state.todos, action.payload.tempTodo],
      };
    }

    case 'updateTodo': {
      return updateTodo(state, action.payload.updatedTodo);
    }

    case 'updateTodoId': {
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.temporaryId
            ? { ...todo, id: action.payload.serverId }
            : todo,
        ),
      };
    }

    case 'deleteTodo': {
      return deleteTodo(state, action.payload.id);
    }

    case 'clearCompleted': {
      return clearCompleted(state);
    }

    case 'activeTab': {
      return activeTab(state, action.payload.tab);
    }

    case 'toggleAll': {
      return toggleAll(state, action.payload.updatedTodos);
    }

    case 'setError': {
      return {
        ...state,
        error: action.payload.errorMessage,
      };
    }

    case 'clearError': {
      return {
        ...state,
        error: '',
      };
    }

    case 'setLoading': {
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };
    }

    case 'setItemLoading': {
      return {
        ...state,
        isLoadingItems: {
          ...state.isLoadingItems,
          [action.payload.id]: action.payload.isLoading, // Set loading state for specific item
        },
      };
    }

    default: {
      return state;
    }
  }
}

interface ContextProps {
  dispatch: React.Dispatch<Action>;
  resetErrorMessage: () => void;
}

export const TodoContext = React.createContext(initialState);
export const DispatchContext = React.createContext<ContextProps>({
  dispatch: () => {},
  resetErrorMessage: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const GlobalContext: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const resetErrorMessage = (delay = 3000) => {
    setTimeout(() => {
      dispatch({ type: 'clearError' });
    }, delay);
  };

  return (
    <DispatchContext.Provider value={{ dispatch, resetErrorMessage }}>
      <TodoContext.Provider value={state}>{children}</TodoContext.Provider>
    </DispatchContext.Provider>
  );
};
