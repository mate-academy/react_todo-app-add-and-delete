/* eslint-disable */
import React, {
  Dispatch,
  useEffect,
  useReducer,
} from "react";
import { Todo } from "../types/Todo";
import { getTodos } from '../api/todos';
import { FILTER, ACTIONS } from '.././utils/enums';

const USER_ID = 11384;

type Action = { type: ACTIONS.SORT, payload: string }
  | { type: ACTIONS.SET_LIST, payload: Todo[] }
  | { type: ACTIONS.SET_ERROR, payload: string }

interface Data {
  list: Todo[],
  sortBy: string,
  totalLength: number,
  error: string,
};

function reducer(state: Data, action: Action): Data {
  switch (action.type) {
    case ACTIONS.SORT:
      return {
          ...state,
          sortBy: action.payload,
        };
    case ACTIONS.SET_LIST:
      return {
          ...state,
          list: action.payload,
          totalLength: action.payload.length,
        };
    case ACTIONS.SET_ERROR:
      return {
          ...state,
          error: action.payload,
        };
    default:
      return state;
  }
}

type State = {
  state: Data,
  dispatch: Dispatch<Action>,
};

const initialState: State = {
  state : {
    list: [],
    sortBy: 'All',
    totalLength: 0,
    error: '',
  },
  dispatch: () => { },
};

export const StateContext = React.createContext(initialState);

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState.state);

  useEffect(() => {
    getTodos(USER_ID)
      .then(res => {
        dispatch({ type: ACTIONS.SET_LIST, payload: res })
      })
      .catch(() => dispatch({ type: ACTIONS.SET_ERROR, payload: 'Can`t load the page' }))
  }, []);

  function filteredTodos(): Todo[] {
    switch (state.sortBy) {
      case FILTER.ALL:
        return [...state.list];
      case FILTER.COMPLETED:
        return state.list.filter(todo => todo.completed);
      case FILTER.ACTIVE:
        return state.list.filter(todo => !todo.completed);
      default:
        return state.list;
    }
  }

  return (
    <StateContext.Provider value={{
      state: {
        ...state,
        list: filteredTodos(),
      },
      dispatch,
    }}>
      {children}
    </StateContext.Provider>
  )

}



