import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { State } from '../types/State';
import { Action } from '../types/Action';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';
import { InitialContextData } from '../types/InitialContextData';
import * as todoService from '../api/todos';

// const savedData = localStorage.getItem('todos');

const initialState: State = {
  todos: [],
  filter: Filter.All,
  error: '',
  tempTodo: null,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setTodos':
      return {
        ...state,
        todos: action.payload,
      };
    case 'setTempTodo':
      return {
        ...state,
        tempTodo: action.payload,
      };

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
        todos: state.todos.filter((todo: Todo) => todo.id !== action.payload),
      };

    case 'setFilter':
      return {
        ...state,
        filter: action.payload,
      };

    case 'setError':
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

const AppContext = createContext<InitialContextData>({
  state: initialState,
  setFilter: () => {},
  setTodos: () => {},
  addTodo: () => new Promise(() => {}),
  // updateTodo: () => new Promise(() => {}),
  deleteTodo: () => new Promise(() => {}),
  setTempTodo: () => {},
  setError: () => {},
});

export const AppContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setTodos = (todos: Todo[]) => {
    dispatch({ type: 'setTodos', payload: todos });
  };

  const setError = (errorMessage: string) => {
    dispatch({ type: 'setError', payload: errorMessage });
    setTimeout(() => dispatch({ type: 'setError', payload: '' }), 3000);
  };

  const setFilter = (filterType: Filter) => {
    dispatch({ type: 'setFilter', payload: filterType });
  };

  const setTempTodo = (todo: Todo | null) => {
    dispatch({ type: 'setTempTodo', payload: todo });
  };

  const addTodo = (title: string) => {
    const newTodo = {
      userId: todoService.USER_ID,
      title,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    return todoService
      .addTodo(newTodo)
      .then(res => dispatch({ type: 'addTodo', payload: res }))
      .catch(error => {
        setError('Unable to add a todo');
        throw error;
      })
      .finally(() => setTempTodo(null));
  };

  const deleteTodo = (id: number) => {
    setError('');

    return todoService
      .deleteTodo(id)
      .then(() => dispatch({ type: 'deleteTodo', payload: id }))
      .catch(error => {
        setError('Unable to delete a todo');
        throw error;
      });
  };

  useEffect(() => {
    // if (!state.todos.length) {
    todoService
      .getTodos()
      .then(todos => {
        setTodos(todos);
        // localStorage.setItem('todos', JSON.stringify(fetchedData));
      })
      .catch(() => {
        setError('Unable to load todos');
      });
    // }

    // localStorage.setItem('todos', JSON.stringify(state.todos));
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        setTodos,
        setError,
        setFilter,
        setTempTodo,
        addTodo,
        deleteTodo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
