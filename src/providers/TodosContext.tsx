import {
  FC, createContext, useContext, useEffect, useReducer,
} from 'react';
import { Todo } from '../types/Todo';
import { getTodos } from '../api/todos';
import { USER_ID } from '../constants/userId';

type Action =
  { type: 'setTodos', payload: Todo[] }
  | { type: 'setError', payload: { isError: boolean, errorMessage?: string } };

export enum FilterBy {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}

type State = {
  todos: Todo[]
  filter: FilterBy
  isError: boolean
  errorMessage: string
  fetchTodos: () => void
  updateTodos: () => void
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setTodos':
      return { ...state, todos: action.payload };

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
  filter: FilterBy.ALL,
  todos: [],
  isError: false,
  errorMessage: '',
  fetchTodos: () => { },
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

    if (state.errorMessage) {
      setTimeout(() => {
        dispatch({ type: 'setError', payload: { isError: false } });
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [state.errorMessage]);

  useEffect(fetchTodos, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={{ ...state, fetchTodos, updateTodos }}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};
