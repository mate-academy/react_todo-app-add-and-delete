import {
  useMemo,
  useEffect,
  useContext,
  useReducer,
  createContext,
} from 'react';

import { Action, Todo } from '../types';
import { getTodos } from '../api';
import { useError } from './ErrorProvider';
import { ERRORS } from '../utils';

type TodosContextValue = {
  todos: Todo[];
  dispatch: React.Dispatch<TodosDispatchAction>;
};

export const TodosContext = createContext<TodosContextValue>({
  todos: [],
  dispatch: () => {},
});

export function useTodos() {
  return useContext(TodosContext);
}

type TodosDispatchAction = { type: Action.Set, payload: Todo[] }
| { type: Action.Add, payload: Todo }
| { type: Action.Remove, payload: number }
| { type: Action.Edit, payload: { id: number, title: string } }
| { type: Action.Toggle, payload: number }
| { type: Action.ToggleAll }
| { type: Action.ClearCompleted };

function todosReducer(state: Todo[], action: TodosDispatchAction): Todo[] {
  switch (action.type) {
    case Action.Set: {
      return [...action.payload];
    }

    case Action.Add: {
      return [...state, action.payload];
    }

    case Action.Edit: {
      const index = state.findIndex(({ id }) => id === action.payload.id);
      const oldTodo = state[index];
      const newTodo = {
        ...oldTodo,
        title: action.payload.title,
      };

      return [
        ...state.slice(0, index),
        newTodo,
        ...state.slice(index + 1),
      ];
    }

    case Action.Remove: {
      return state.filter(({ id }) => id !== action.payload);
    }

    case Action.Toggle: {
      const index = state.findIndex(({ id }) => id === action.payload);
      const oldTodo = state[index];
      const newTodo = {
        ...oldTodo,
        completed: !oldTodo.completed,
      };

      return [
        ...state.slice(0, index),
        newTodo,
        ...state.slice(index + 1),
      ];
    }

    case Action.ToggleAll: {
      const hasActive = state.some(({ completed }) => !completed);

      return state.map(todo => {
        if (hasActive) {
          return todo.completed
            ? todo
            : {
              ...todo,
              completed: true,
            };
        }

        return {
          ...todo,
          completed: false,
        };
      });
    }

    case Action.ClearCompleted: {
      return state.filter(({ completed }) => !completed);
    }

    default:
      throw new Error('Unsupported action.');
  }
}

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, dispatch] = useReducer(todosReducer, []);
  const { setError } = useError();

  useEffect(() => {
    getTodos()
      .then(todosFromServer => {
        dispatch({
          type: Action.Set,
          payload: todosFromServer,
        });
      })
      .catch(() => {
        setError(ERRORS.LOAD_TODOS);
      });
  }, []);

  const contextValue = useMemo(() => ({
    todos,
    dispatch,
  }), [todos]);

  return (
    <TodosContext.Provider value={contextValue}>
      {children}
    </TodosContext.Provider>
  );
};
