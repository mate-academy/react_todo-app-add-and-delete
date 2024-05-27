import React, { useEffect, useMemo, useReducer } from 'react';
import * as api from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

type Props = {
  children: React.ReactNode;
};

type State = {
  todos: Todo[];
  tempTodo: Todo | null;
  filter: Filter;
  errorMessage: string;
};

type Action =
  | { type: 'setFilter'; payload: Filter }
  | { type: 'setTodos'; payload: Todo[] }
  | { type: 'addTodo'; payload: Todo }
  | { type: 'updateTodo'; payload: Todo }
  | { type: 'deleteTodo'; payload: number }
  | { type: 'setTempTodo'; payload: Todo | null }
  | { type: 'setErrorMessage'; payload: string };

type TodoContextType = State & {
  setFilter: (payload: Filter) => void;
  setTodos: (payload: Todo[]) => void;
  addTodo: (payload: string) => Promise<void>;
  updateTodo: (payload: Todo) => Promise<void>;
  deleteTodo: (payload: number) => Promise<void>;
  setTempTodo: (payload: Todo) => void;
  setErrorMessage: (payload: string) => void;
};

export const TodoContext = React.createContext<TodoContextType>({
  todos: [],
  tempTodo: null,
  filter: Filter.All,
  errorMessage: '',
  setFilter: () => {},
  setTodos: () => {},
  addTodo: () => new Promise(() => {}),
  updateTodo: () => new Promise(() => {}),
  deleteTodo: () => new Promise(() => {}),
  setTempTodo: () => {},
  setErrorMessage: () => {},
});

const initialState: State = {
  todos: [],
  tempTodo: null,
  filter: Filter.All,
  errorMessage: '',
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setFilter':
      return { ...state, filter: action.payload };

    case 'setTodos':
      return { ...state, todos: action.payload };

    case 'addTodo':
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };

    case 'updateTodo':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? action.payload : todo,
        ),
      };

    case 'deleteTodo':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };

    case 'setTempTodo':
      return {
        ...state,
        tempTodo: action.payload,
      };

    case 'setErrorMessage':
      return {
        ...state,
        errorMessage: action.payload,
      };

    default:
      return state;
  }
}

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [{ todos, tempTodo, filter, errorMessage }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  const setFilter = (newFilter: Filter) => {
    dispatch({ type: 'setFilter', payload: newFilter });
  };

  const setErrorMessage = (newErrorMessage: string) => {
    dispatch({ type: 'setErrorMessage', payload: newErrorMessage });

    setTimeout(() => dispatch({ type: 'setErrorMessage', payload: '' }), 3000);
  };

  const setTempTodo = (todo: Todo | null) => {
    dispatch({ type: 'setTempTodo', payload: todo });
  };

  // Interact with todos
  const setTodos = (newTodos: Todo[]) => {
    dispatch({ type: 'setTodos', payload: newTodos });
  };

  const addTodo = (title: string) => {
    setTempTodo({ id: 0, userId: api.USER_ID, title, completed: false });
    setErrorMessage('');

    return api
      .addTodo(title)
      .then(response => dispatch({ type: 'addTodo', payload: response }))
      .catch(error => {
        setErrorMessage('Unable to add a todo');
        throw error;
      })
      .finally(() => setTempTodo(null));
  };

  const updateTodo = (todo: Todo) => {
    setErrorMessage('');

    return api
      .updateTodo(todo)
      .then(() => dispatch({ type: 'updateTodo', payload: todo }))
      .catch(error => {
        setErrorMessage('Unable to update a todo');
        throw error;
      });
  };

  const deleteTodo = (id: number) => {
    setErrorMessage('');

    return api
      .deleteTodo(id)
      .then(() => dispatch({ type: 'deleteTodo', payload: id }))
      .catch(error => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      });
  };

  const value = useMemo(
    () => ({
      todos,
      tempTodo,
      filter,
      errorMessage,
      setFilter,
      setTodos,
      addTodo,
      updateTodo,
      deleteTodo,
      setTempTodo,
      setErrorMessage,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [todos, tempTodo, filter, errorMessage],
  );

  useEffect(() => {
    api
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
