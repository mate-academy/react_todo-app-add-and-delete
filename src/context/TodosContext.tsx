import { createContext, useContext, useEffect, useReducer } from 'react';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';
import { getTodos } from '../api/todos';
import { wait } from '../utils/fetchClient';

type FilterStatus = keyof typeof Status;

type State = {
  todos: Todo[];
  tempTodo: Todo | null;
  isLoading: boolean;
  todosError: string;
  filterStatus: FilterStatus;
  isDeletingAllCompleted: boolean;
  addTodo: (todo: Todo) => void;
  handleDeleteTodo: (id: number) => void;
  setTempTodo: (todo: Todo | null) => void;
  toggleAllTodo: () => void;
  handleFilterTodo: (status: FilterStatus) => void;
  handleSetError: (errorMessage: string) => void;
  handleRemoveError: () => void;
};

const initialState: State = {
  todos: [],
  tempTodo: null,
  isLoading: false,
  todosError: '',
  filterStatus: 'All',
  isDeletingAllCompleted: false,
  addTodo: () => {},
  handleDeleteTodo: () => {},
  setTempTodo: () => {},
  toggleAllTodo: () => {},
  handleFilterTodo: () => {},
  handleSetError: () => {},
  handleRemoveError: () => {},
};

type TodosContextType = State & {
  dispatch: React.Dispatch<Action>;
};

const TodosContext = createContext<TodosContextType>({
  ...initialState,
  dispatch: () => {},
});

type Action =
  | { type: 'todos/addTodo'; payload: Todo }
  | { type: 'todos/delete'; payload: number }
  | { type: 'todos/loaded'; payload: Todo[] }
  | { type: 'todos/setTempTodo'; payload: Todo | null }
  | { type: 'todos/setFilterStatus'; payload: FilterStatus }
  | { type: 'rejected'; payload: string }
  | { type: 'todos/removeError' }
  | { type: 'todos/toggleAll' }
  | { type: 'todos/setError'; payload: string }
  | { type: 'loading'; payload: boolean }
  | { type: 'todos/setIsDeletingAllCompleted'; payload: boolean };

type Props = {
  children: React.ReactNode;
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'todos/addTodo':
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };

    case 'todos/delete':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };

    case 'loading':
      return { ...state, isLoading: action.payload };

    case 'todos/setIsDeletingAllCompleted':
      return { ...state, isDeletingAllCompleted: action.payload };

    case 'todos/loaded':
      return { ...state, isLoading: false, todos: action.payload };

    case 'todos/setFilterStatus':
      return {
        ...state,
        filterStatus: action.payload,
      };

    case 'todos/setTempTodo':
      return {
        ...state,
        tempTodo: action.payload,
      };
    // Cant't Fix because of prettier
    /* eslint-disable */
    case 'todos/toggleAll':
      return {
        ...state,
        todos: state.todos.every(todo => todo.completed)
          ? state.todos.map(todo => ({
              ...todo,
              completed: false,
            }))
          : state.todos.map(todo => ({
              ...todo,
              completed: true,
            })),
      };
    /* eslint-disable */
    case 'todos/setError':
      return { ...state, todosError: action.payload };

    case 'todos/removeError':
      return { ...state, todosError: '' };

    case 'rejected':
      return { ...state, isLoading: false, todosError: action.payload };
    default:
      return state;
  }
}

const TodosProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    todos,
    filterStatus,
    isDeletingAllCompleted,
    isLoading,
    todosError,
    tempTodo,
  } = state;

  const handleRemoveError = () => {
    dispatch({ type: 'todos/removeError' });
  };

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: 'loading', payload: true });
      try {
        const fetchedTodos = await getTodos();

        dispatch({ type: 'todos/loaded', payload: fetchedTodos });
      } catch {
        dispatch({
          type: 'rejected',
          payload: 'Unable to load todos',
        });

        wait(3000).then(handleRemoveError);
      } finally {
        dispatch({ type: 'loading', payload: false });
      }
    };

    fetchTodos();
  }, []);

  const addTodo = (todo: Todo) => {
    dispatch({ type: 'todos/addTodo', payload: todo });
  };

  const handleDeleteTodo = (id: number) => {
    dispatch({ type: 'todos/delete', payload: id });
  };

  const setTempTodo = (todo: Todo | null) => {
    dispatch({ type: 'todos/setTempTodo', payload: todo });
  };

  const handleFilterTodo = (status: FilterStatus) => {
    dispatch({ type: 'todos/setFilterStatus', payload: status });
  };

  const toggleAllTodo = () => {
    dispatch({ type: 'todos/toggleAll' });
  };

  const handleSetError = (errorMessage: string) => {
    dispatch({ type: 'todos/setError', payload: errorMessage });

    wait(3000).then(handleRemoveError);
  };

  return (
    <TodosContext.Provider
      value={{
        addTodo,
        todos,
        tempTodo,
        isLoading,
        todosError,
        filterStatus,
        isDeletingAllCompleted,
        setTempTodo,
        handleDeleteTodo,
        handleRemoveError,
        handleFilterTodo,
        toggleAllTodo,
        handleSetError,
        dispatch,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};

const useTodos = () => {
  const context = useContext(TodosContext);

  if (context === undefined) {
    throw new Error('TodosContext was used outside of the PostProvider');
  }

  return context;
};

export { useTodos, TodosProvider };
