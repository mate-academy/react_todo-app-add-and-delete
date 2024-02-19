import { createContext, useEffect, useReducer } from 'react';
import { Todo } from '../Types/Todo';
import { getTodos } from '../api/todos';
import { Status } from '../Types/Status';

const USER_ID = 56;

type Action = { type: 'loadTodos', payload: Todo[] }
| { type: 'addTodo', payload: Todo }
| { type: 'addTempTodo', payload: Todo | null }
| { type: 'deleteTodo', payload: number }
| { type: 'filterBy', payload: Status }
| { type: 'changeTodo', payload: Todo }
| { type: 'clearCompleted' }
| { type: 'setLoading', payload: { isLoading: boolean, todoIds: number[] } };

type State = {
  todos: Todo[];
  tempTodo: Todo | null;
  filterBy: Status;
  loading: { isLoading: boolean, todoIds: number[] };
};

const initialState = {
  todos: [],
  tempTodo: null,
  filterBy: Status.ALL,
  loading: { isLoading: false, todoIds: [] },
};

export const StateContext = createContext<State>(initialState);
export const DispatchContext
  = createContext<(action: Action) => void>(() => { });

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'loadTodos':
      return {
        ...state,
        todos: action.payload,
      };

    case 'addTodo':
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };

    case 'deleteTodo':
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };

    case 'filterBy':
      return {
        ...state,
        filterBy: action.payload,
      };

    case 'changeTodo':
      return {
        ...state,
        todos: state.todos.map((todo) => {
          if (todo.id === action.payload.id) {
            return action.payload;
          }

          return todo;
        }),
      };

    case 'clearCompleted':
      return {
        ...state,
        todos: state.todos.filter((todo) => !todo.completed),
      };

    case 'setLoading':
      return {
        ...state,
        loading: {
          isLoading: action.payload.isLoading,
          todoIds: action.payload.todoIds,
        },
      };

    default:
      return state;
  }
};

type Props = {
  children: React.ReactNode;
};

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getTodos(USER_ID)
      .then((response) => dispatch({ type: 'loadTodos', payload: response }));
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};
