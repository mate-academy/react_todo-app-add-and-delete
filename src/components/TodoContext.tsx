/* eslint-disable @typescript-eslint/indent */
import React, { useCallback } from 'react';
import { useEffect, useMemo, useReducer } from 'react';

import { Todo } from '../types/Todo';
import { FilterAction, ListAct } from '../types/Actions';
import * as api from '../api/todos';

export type Action =
  | { type: 'addTodo'; payload: Todo }
  | { type: 'deleteTodo'; payload: number }
  | { type: 'updateTodo'; payload: Todo }
  | { type: ListAct.ClearComplet }
  | { type: ListAct.SetComplet; payload: { id: number; completed: boolean } }
  | { type: ListAct.SetAllComplet }
  | { type: ListAct.setError; payload: string }
  | { type: 'setTodos'; payload: Todo[] }
  | { type: 'setTempTodos'; payload: Todo | null }
  | { type: 'setFilter'; payload: FilterAction }
  | { type: 'setError'; payload: string };

type State = {
  todos: Todo[];
  tempTodo: Todo | null;
  filter: FilterAction;
  error: string;
};

type ContextProps = State & {
  setFilter: (payload: FilterAction) => void;
  setTodos: (payload: Todo[]) => void;
  addTodo: (payload: string) => Promise<void>;
  updateTodo: (payload: Todo) => Promise<void>;
  deleteTodo: (payload: number) => Promise<void>;
  setTempTodo: (payload: Todo) => void;
  setError: (errorMessage: string) => void;
  dispatch: (type: Action) => void;
};

const initialState: State = {
  todos: [],
  tempTodo: null,
  filter: FilterAction.All,
  error: '',
};

type ProviderProps = {
  children: React.ReactNode;
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setFilter':
      return { ...state, filter: action.payload };

    case 'setTodos':
      return { ...state, todos: action.payload };

    case 'setError':
      return { ...state, error: action.payload };

    case 'addTodo':
      return { ...state, todos: [...state.todos, action.payload] };

    case 'deleteTodo':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };

    case 'updateTodo':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? action.payload : todo,
        ),
      };

    case 'setTempTodos':
      return { ...state, tempTodo: action.payload };

    // case ListAct.SetComplet:
    //   return {
    //     ...state,
    //     todos: state.todos.map(todo =>
    //       todo.id === action.payload.id
    //         ? { ...todo, completed: action.payload.completed }
    //         : todo,
    //     ),
    //   };

    // case ListAct.ClearComplet:
    //   return {
    //     ...state,
    //     todos: state.todos.filter(todo => todo.completed === false),
    //   };

    // case ListAct.SetAllComplet:
    //   const completed = {
    //     ...state,
    //     todos: state.todos.some(todo => !todo.completed),
    //   };

    //   return {
    //     ...state,
    //     todos: state.todos.map(todo => {
    //       return { ...state, completed: completed };
    //     }),
    //   };

    default:
      return state;
  }
};

export const TodoContext = React.createContext<ContextProps>({
  todos: [],
  tempTodo: null,
  filter: FilterAction.All,
  error: '',
  setFilter: () => {},
  setTodos: () => {},
  addTodo: () => new Promise(() => {}),
  updateTodo: () => new Promise(() => {}),
  deleteTodo: () => new Promise(() => {}),
  setTempTodo: () => {},
  setError: () => {},
  dispatch: () => {},
});

export const TodoProvider: React.FC<ProviderProps> = ({ children }) => {
  const [{ todos, tempTodo, error, filter }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  const setFilter = useCallback((tempFilter: FilterAction) => {
    dispatch({ type: 'setFilter', payload: tempFilter });
  }, []);

  const setError = (errorMessage: string) => {
    dispatch({
      type: 'setError',
      payload: errorMessage,
    });
    setTimeout(() => dispatch({ type: 'setError', payload: '' }), 3000);
  };

  const setTodos = (tempTodos: Todo[]) => {
    dispatch({ type: 'setTodos', payload: tempTodos });
  };

  const setTempTodo = (todo: Todo | null) => {
    dispatch({ type: 'setTempTodos', payload: todo });
  };

  const addTodo = (title: string) => {
    setTempTodo({
      id: 0,
      userId: api.USER_ID,
      title,
      completed: false,
    });

    return api
      .addTodo(title)
      .then(response => dispatch({ type: 'addTodo', payload: response }))
      .catch(tempError => {
        setError('Unable to add a todo');
        throw tempError;
      })
      .finally(() => setTempTodo(null));
  };

  const updateTodo = (todo: Todo) => {
    return api
      .updateTodo(todo)
      .then(() => dispatch({ type: 'updateTodo', payload: todo }))
      .catch(tempError => {
        setError('Unable to update a todo');
        throw tempError;
      });
  };

  const deleteTodo = (id: number) => {
    return api
      .deleteTodo(id)
      .then(() => dispatch({ type: 'deleteTodo', payload: id }))
      .catch(tempError => {
        setError('Unable to delete a todo');
        throw tempError;
      });
  };

  const value = useMemo(
    () => ({
      todos,
      tempTodo,
      filter,
      error,
      setFilter,
      setTodos,
      addTodo,
      updateTodo,
      deleteTodo,
      setTempTodo,
      setError,
      dispatch,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [todos, tempTodo, filter, error, setFilter],
  );

  // useEffect(() => {
  //   const storedTodos = JSON.parse(localStorage.getItem('todos') as string);

  //   if (storedTodos) {
  //     storedTodos.forEach((todo: Todo) => {
  //       dispatch({ type: ListAct.Add, payload: todo });
  //     });
  //   }
  // }, []);

  useEffect(() => {
    api
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
