import {
  FC, createContext, useContext, useEffect, useReducer,
} from 'react';
import { Todo } from '../types/Todo';
import { getTodos } from '../api/todos';
import { USER_ID } from '../constants/userId';

type Action =
  { type: 'setTodos', payload: Todo[] }
  | { type: 'setTempTodo', payload: Todo | null }
  | { type: 'setInProcess', payload: number[] }
  | { type: 'setError', payload: { isError: boolean, errorMessage?: string } };

type State = {
  todos: Todo[]
  tempTodo: Todo | null
  inProcess: number[]
  isError: boolean
  errorMessage: string
  updateTodos: () => void
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setTodos':
      return { ...state, todos: action.payload };

    case 'setTempTodo':
      return { ...state, tempTodo: action.payload };

    case 'setInProcess':
      return { ...state, inProcess: action.payload };

    case 'setError':
      return {
        ...state,
        isError: action.payload.isError,
        errorMessage: action.payload.errorMessage || state.errorMessage,
      };

    default:
      return state;
  }
}

const initialState: State = {
  todos: [],
  tempTodo: null,
  inProcess: [],
  isError: false,
  errorMessage: '',
  updateTodos: () => { },
};

const StateContext = createContext(initialState);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DispatchContext = createContext((_action: Action) => { });

export const useSelector = () => useContext(StateContext);

export const useDispatch = () => useContext(DispatchContext);

type Props = {
  children: React.ReactNode
};

export const GlobalStateProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchTodos = () => {
    getTodos(USER_ID)
      .then(todos => {
        dispatch({ type: 'setTodos', payload: todos });
      })
      .catch(() => {
        dispatch({
          type: 'setError',
          payload: {
            isError: true,
            errorMessage: 'Unable to load todos',
          },
        });
      });
  };

  const updateTodos = () => {
    fetchTodos();
  };

  useEffect(() => {
    const timeoutId = 0;

    if (state.isError) {
      setTimeout(() => {
        dispatch({ type: 'setError', payload: { isError: false } });
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [state.isError]);

  useEffect(fetchTodos, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={{ ...state, updateTodos }}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};
