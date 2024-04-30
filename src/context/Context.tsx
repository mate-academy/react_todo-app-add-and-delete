import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { State } from '../types/State';
import { Action } from '../types/Action';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';
import { InitialContextData } from '../types/InitialContextData';
import { getTodos } from '../api/todos';

// const savedData = localStorage.getItem('todos');

const initialState: State = {
  todos: [],
  filter: Filter.All,
  error: '',
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setTodos':
      return {
        ...state,
        todos: action.payload,
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
  dispatch: () => {},
});

export const AppContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setError = (errorMessage: string) => {
    dispatch({ type: 'setError', payload: errorMessage });
    setTimeout(() => dispatch({ type: 'setError', payload: '' }), 3000);
  };

  useEffect(() => {
    // if (!state.todos.length) {
    getTodos()
      .then(todos => {
        dispatch({ type: 'setTodos', payload: todos });
        // localStorage.setItem('todos', JSON.stringify(fetchedData));
      })
      .catch(() => {
        setError('Unable to load todos');
      });
    // }

    // localStorage.setItem('todos', JSON.stringify(state.todos));
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
