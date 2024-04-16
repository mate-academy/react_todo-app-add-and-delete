/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useReducer } from 'react';
import { Todo } from '../types/Todo';
import {
  USER_ID,
  addTodo,
  deleteTodo,
  getTodos,
  updateTodoCompleted,
  updateTodoTitle,
} from '../api/todos';

export type Action =
  | { type: 'setTodoApi'; payload: Todo[] }
  | { type: 'setTotalLenght'; payload: Todo[] }
  | { type: 'setError'; error: string }
  | { type: 'setQuery'; value: string }
  | { type: 'addTodo' }
  | { type: 'setSelect'; value: string }
  | { type: 'setFetch'; value: boolean }
  | { type: 'deleteTodo'; currentId: number }
  | { type: 'disableFetch' }
  | { type: 'setComplate'; currentId: number; currentComplate: boolean }
  | { type: 'setEdit'; currentId: number }
  | { type: 'setNewTitle'; value: string; currentId: number }
  | { type: 'submitNewTitile'; currentId: number; currentTitle: string }
  | { type: 'setAllCompleted'; currentComleted: boolean }
  | { type: 'deleteAllCompleted' };

interface State {
  totalLength: Todo[];
  todoApi: Todo[];
  select: string;
  selectedAll: boolean;
  error: string;
  query: string;
  fetch: boolean;
  currentId: number;
  prevTitle: string;
  showError: string;
  todoLoading: Record<number, boolean>;
  allTodoLoading: boolean;
  addItem: boolean;
  focus: boolean;
}

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setTodoApi':
      return {
        ...state,
        todoApi: action.payload,
      };

    case 'setTotalLenght':
      return {
        ...state,
        totalLength: action.payload,
      };

    case 'setError':
      return {
        ...state,
        showError: action.error,
      };

    case 'setQuery':
      return {
        ...state,
        query: action.value,
      };

    case 'addTodo':
      const newTodo: Omit<Todo, 'id'> = {
        userId: USER_ID,
        title: state.query.trim(),
        completed: false,
      };

      if (!state.query.trim()) {
        return {
          ...state,
          fetch: true,
          showError: 'Title should not be emptys',
        };
      }

      addTodo(newTodo);

      return {
        ...state,
        query: '',
        fetch: true,
        error: 'Unable to add a todo',
        addItem: true,
      };

    case 'setSelect':
      return {
        ...state,
        select: action.value,
      };

    case 'setFetch':
      return {
        ...state,
        fetch: action.value,
      };

    case 'deleteTodo':
      deleteTodo(action.currentId);

      return {
        ...state,
        cuurrentId: action.currentId,
        fetch: true,
        error: 'Unable to delete a todo',
        todoLoading: {
          ...state.todoLoading,
          [action.currentId]: true,
        },
      };

    case 'disableFetch':
      return {
        ...state,
        fetch: false,
        todoLoading: {
          [state.currentId]: false,
        },
        allTodoLoading: false,
        addItem: false,
        focus: true,
      };

    case 'setComplate':
      const setComplate = action.currentComplate ? false : true;

      updateTodoCompleted({
        id: action.currentId,
        completed: setComplate,
      });

      return {
        ...state,
        cuurrentId: action.currentId,
        fetch: true,
        error: 'Unable to update a todo',
        todoLoading: {
          [action.currentId]: true,
        },
      };

    case 'setEdit':
      return {
        ...state,
        currentId: action.currentId,
        focus: false,
      };

    case 'setNewTitle':
      updateTodoTitle({
        id: action.currentId,
        title: action.value,
      });

      return state;

    case 'submitNewTitile':
      return {
        ...state,
        fetch: true,
        currentId: action.currentId,
        error: 'Unable to update a todo',
        todoLoading: {
          [state.currentId]: true,
        },
      };

    case 'setAllCompleted':
      const currentedCompleted = action.currentComleted ? false : true;

      getTodos().then(todos =>
        todos.map(todo =>
          updateTodoCompleted({ id: todo.id, completed: currentedCompleted }),
        ),
      );

      return {
        ...state,
        fetch: true,
        error: 'Unable to update a todo',
        allTodoLoading: true,
      };

    case 'deleteAllCompleted':
      getTodos().then(todos =>
        todos.map(todo => {
          if (todo.completed) {
            deleteTodo(todo.id);
          }
        }),
      );

      return {
        ...state,
        fetch: true,
        error: 'Unable to delete a todo',
        allTodoLoading: true,
      };

    default:
      return state;
  }
};

const initialState: State = {
  totalLength: [],
  todoApi: [],
  select: 'All',
  selectedAll: false,
  error: '',
  showError: '',
  query: '',
  fetch: false,
  currentId: 0,
  prevTitle: '',
  todoLoading: {
    [0]: false,
  },
  allTodoLoading: false,
  addItem: false,
  focus: true,
};

export const StateContext = React.createContext(initialState);
export const DispatchContext = React.createContext((_action: Action) => {});

interface Props {
  children: React.ReactNode;
}

export const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const deleteAfterShowError = () => {
    setTimeout(() => dispatch({ type: 'setError', error: '' }), 3000);
  };

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    getTodos()
      .then(todos => {
        todos.map(todo => {
          if (!todo.title.length) {
            deleteTodo(todo.id);
          }
        });

        dispatch({ type: 'setTotalLenght', payload: todos });

        if (mounted) {
          switch (state.select) {
            case 'All':
              dispatch({ type: 'setTodoApi', payload: todos });

              break;

            case 'Active':
              dispatch({
                type: 'setTodoApi',
                payload: todos.filter(todo => !todo.completed),
              });

              break;

            case 'Completed':
              dispatch({
                type: 'setTodoApi',
                payload: todos.filter(todo => todo.completed),
              });

              break;
          }
        }
      })
      .catch(() => {
        if (mounted) {
          const error =
            state.showError === 'Title should not be emptys'
              ? 'Title should not be emptys'
              : state.error;

          dispatch({ type: 'setError', error: error });
        }
      })
      .finally(() => {
        dispatch({ type: 'disableFetch' });
        deleteAfterShowError();
      });

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [state.fetch, state.select]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};
