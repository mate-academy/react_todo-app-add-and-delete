import React, { Dispatch, useEffect, useReducer } from 'react';
import {
  Action, ActionType, ErrorMessage, FilterType, Item,
} from '../types/Todo';
import { getTodos } from '../api/todos';

type Props = {
  children: React.ReactNode;
};
type State = {
  todos: Item[],
  tempTodo: Item | null,
  filterBy: FilterType,
  error: string,
  processed: number[],
};

function getFilterValue(): FilterType {
  switch (window.location.hash) {
    case '#/active':
      return FilterType.ACTIVE;
    case '#/completed':
      return FilterType.COMPLETED;
    default:
      return FilterType.ALL;
  }
}

const initialState: State = {
  todos: [],
  tempTodo: null,
  filterBy: getFilterValue(),
  error: '',
  processed: [],
};

export const TodosContext = React.createContext<{
  state: State;
  dispatch: Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => {},
});

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.LOAD:
      return {
        ...state,
        todos: action.payload,
      };
    case ActionType.ADD:
      return {
        ...state,
        todos: [
          ...state.todos,
          action.payload,
        ],
      };
    case ActionType.REMOVE:
      return {
        ...state,
        todos: state.todos.filter(item => item.id !== action.payload),
      };
    case ActionType.TOGGLE:
      return {
        ...state,
        todos: state.todos.map(item => {
          if (item.id === action.payload) {
            return { ...item, completed: !item.completed };
          }

          return item;
        }),
      };
    case ActionType.UPDATE:
      return {
        ...state,
        todos: state.todos.map(item => {
          if (item.id === action.payload.id) {
            return action.payload;
          }

          return item;
        }),
      };
    case ActionType.UPDATE_TEMP:
      return {
        ...state,
        tempTodo: action.payload,
      };
    case ActionType.REMOVE_COMPLETED:
      return {
        ...state,
        todos: state.todos.filter(item => !item.completed),
      };
    case ActionType.TOGGLE_ALL: {
      const allCompleted = state.todos.every(item => item.completed);

      return {
        ...state,
        todos: state.todos.map(item => (
          {
            ...item,
            completed: !allCompleted,
          }
        )),
      };
    }

    case ActionType.FILTER:
      return {
        ...state,
        filterBy: action.payload,
      };
    case ActionType.ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case ActionType.PROCESSED:
      return {
        ...state,
        processed: action.payload,
      };
    default:
      return state;
  }
}

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [
    state,
    dispatch,
  ] = useReducer(reducer, { ...initialState, todos: initialState.todos });

  useEffect(() => {
    const handleHashChange = () => {
      dispatch({ type: ActionType.FILTER, payload: getFilterValue() });
    };

    window.addEventListener('hashchange', handleHashChange);

    getTodos()
      .then(data => {
        dispatch({ type: ActionType.LOAD, payload: data });
      })
      .catch(() => dispatch({
        type: ActionType.ERROR,
        payload: ErrorMessage.UNABLE_LOAD,
      }));

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <TodosContext.Provider value={{ state, dispatch }}>
      {children}
    </TodosContext.Provider>
  );
};
