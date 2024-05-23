import {
  ReactNode,
  createContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { State } from '../types/State';
import { Action } from '../types/Action';
import { AppContextType } from '../types/AppContextType';
import { getTodos } from '../api/todos';
import { Error } from '../types/Error';
import { updateErrorState } from '../utils/errorHandler';
import { Filter } from '../types/Filter';

const initialErrorState: Error[] = [
  { type: 'TodoLoadError', textError: 'Unable to load todos', value: false },
  {
    type: 'EmptyTitleError',
    textError: 'Title should not be empty',
    value: false,
  },
  { type: 'AddTodoError', textError: 'Unable to add a todo', value: false },
  {
    type: 'DeleteTodoError',
    textError: 'Unable to delete a todo',
    value: false,
  },
  {
    type: 'UpdateTodoError',
    textError: 'Unable to update a todo',
    value: false,
  },
];

const initialState: State = {
  todos: [],
  filteredTodos: [],
  filter: Filter.All,
  errors: initialErrorState,
  targetTodo: 0,
  targetDeleteDisabled: 0,
  inputDisabled: false,
  todoDeleteDisabled: {
    value: false,
    targetId: 0,
  },
  tempTodo: null,
};

const initialAppContext: AppContextType = {
  state: initialState,
  dispatch: () => null,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_TODOS_FROM_SERVER':
      return {
        ...state,
        todos: action.payload,
        filteredTodos: action.payload,
      };
    case 'UPDATE_ERROR_STATUS':
      return {
        ...state,
        errors: updateErrorState(state.errors, action.payload.type),
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: state.errors.map(error => ({ ...error, value: false })),
      };
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload],
        filteredTodos: [...state.todos, action.payload],
        tempTodo: null,
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
        filteredTodos: state.filteredTodos.filter(
          todo => todo.id !== action.payload,
        ),
      };
    case 'SET_TARGET_TODO':
      return {
        ...state,
        targetTodo: action.payload,
      };
    case 'SET_FILTER':
      const filteredTodos = state.todos.filter(todo => {
        switch (action.payload) {
          case Filter.Active:
            return !todo.completed;
          case Filter.Completed:
            return todo.completed;
          default:
            return true;
        }
      });

      return {
        ...state,
        filteredTodos,
        filter: action.payload,
      };
    case 'SET_INPUT_DISABLED':
      return {
        ...state,
        inputDisabled: action.payload,
      };
    case 'SET_TODO_DISABLED':
      return {
        ...state,
        todoDeleteDisabled: action.payload,
      };
    case 'CREATE_TEMP_TODO':
      return {
        ...state,
        tempTodo: action.payload,
      };
    default:
      return state;
  }
};

const AppContext = createContext(initialAppContext);

type Props = {
  children: ReactNode;
};

export const GlobalAppProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // initial download
  useEffect(() => {
    getTodos()
      .then(data => dispatch({ type: 'LOAD_TODOS_FROM_SERVER', payload: data }))
      .catch(() =>
        dispatch({
          type: 'UPDATE_ERROR_STATUS',
          payload: { type: 'TodoLoadError' },
        }),
      );
  }, []);

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export { AppContext };
