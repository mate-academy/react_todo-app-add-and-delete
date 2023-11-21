/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useReducer } from 'react';

import * as todoService from '../../api/todos';

import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { TodoError } from '../../types/TodoError';

export const USER_ID = 11722;

enum ReducerActions {
  LoadTodos = 'loadTodos',
  UpdateTodos = 'updateTodos',
  // AddTodo = 'addTodo',
  // UpdateTodo = 'updateTodo',
  // DeleteTodo = 'deleteTodo',
  // FilterTodo = 'filterTodo',
  SelectFilter = 'selectFilter',
  AddTempTodo = 'addTempTodo',
  ToggleSubmitting = 'toggleSubmitting',
  ToggleDeleting = 'toggleDeleting',
  ToggleClearing = 'toggleClearing',
  AddTodoError = 'addTodoError',
  ClearTodoErrors = 'clearTodoErrors',
}

interface Action {
  type: ReducerActions;
  payload?: any;
}

interface State {
  initialTodos: Todo[];
  visibleTodos: Todo[];
  selectedFilter: Filter;
  tempTodo: Todo | null;
  isSubmitting: boolean;
  isDeleting: boolean;
  isClearing: boolean;
  todoError: TodoError | null;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ReducerActions.LoadTodos:
      return {
        ...state,
        initialTodos: action.payload,
        visibleTodos: action.payload,
      };

    case ReducerActions.UpdateTodos: {
      let { initialTodos } = state;

      if (action.payload.add) {
        initialTodos = [...initialTodos, action.payload.add];
      }

      if (action.payload.delete) {
        initialTodos = initialTodos
          .filter(todo => action.payload.delete !== todo.id);
      }

      let updatedTodos = [...initialTodos];

      if (action.payload.filter) {
        updatedTodos = updatedTodos.filter(todo => {
          switch (action.payload.filter) {
            case Filter.Active:
              return !todo.completed;

            case Filter.Completed:
              return todo.completed;

            case Filter.All:
            default:
              return true;
          }
        });
      }

      return {
        ...state,
        initialTodos,
        visibleTodos: updatedTodos,
      };
    }

    // case ReducerActions.AddTodo: {
    //   return {
    //     ...state,
    //     initialTodos: [...state.initialTodos, action.payload],
    //   };
    // }

    // case ReducerActions.DeleteTodo:
    //   return {
    //     ...state,
    //     initialTodos: state.initialTodos
    //       .filter(todo => action.payload !== todo.id),
    //   };

    // case ReducerActions.FilterTodo: {
    //   const filteredTodos = state.initialTodos.filter(todo => {
    //     switch (action.payload) {
    //       case Filter.Active:
    //         return !todo.completed;

    //       case Filter.Completed:
    //         return todo.completed;

    //       case Filter.All:
    //       default:
    //         return true;
    //     }
    //   });

    //   return {
    //     ...state,
    //     visibleTodos: filteredTodos,
    //   };
    // }

    case ReducerActions.SelectFilter:
      return {
        ...state,
        selectedFilter: action.payload,
      };

    case ReducerActions.AddTempTodo:
      return {
        ...state,
        tempTodo: action.payload,
      };

    case ReducerActions.ToggleSubmitting:
      return {
        ...state,
        isSubmitting: !state.isSubmitting,
      };

    case ReducerActions.ToggleDeleting:
      return {
        ...state,
        isDeleting: !state.isDeleting,
      };

    case ReducerActions.ToggleClearing:
      return {
        ...state,
        isClearing: !state.isClearing,
      };

    case ReducerActions.AddTodoError:
      return {
        ...state,
        todoError: action.payload,
      };

    case ReducerActions.ClearTodoErrors:
      return {
        ...state,
        todoError: null,
      };

    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

interface UpdateState {
  add?: Todo,
  update?: number,
  delete?: number,
  filter?: Filter,
}

export const actionCreator = {
  load: (payload: Todo[]) => ({ type: ReducerActions.LoadTodos, payload }),
  updateTodos: (payload: UpdateState) => ({
    type: ReducerActions.UpdateTodos, payload,
  }),
  // add: (payload: Todo) => ({ type: ReducerActions.AddTodo, payload }),
  // update: (payload: number) => ({ type: ReducerActions.UpdateTodo, payload }),
  // delete: (payload: number) => ({ type: ReducerActions.DeleteTodo, payload }),
  // filter: (payload: Filter) => ({ type: ReducerActions.FilterTodo, payload }),
  selectFilter: (payload: Filter) => ({
    type: ReducerActions.SelectFilter, payload,
  }),
  addTempTodo: (payload: Todo | null) => ({
    type: ReducerActions.AddTempTodo, payload,
  }),
  toggleSubmitting: () => ({ type: ReducerActions.ToggleSubmitting }),
  toggleDeleting: () => ({ type: ReducerActions.ToggleDeleting }),
  toggleClearing: () => ({ type: ReducerActions.ToggleClearing }),
  addError: (payload: TodoError) => ({
    type: ReducerActions.AddTodoError, payload,
  }),
  clearError: () => ({ type: ReducerActions.ClearTodoErrors }),
};

const initialState: State = {
  initialTodos: [],
  visibleTodos: [],
  selectedFilter: Filter.All,
  tempTodo: null,
  isSubmitting: false,
  isDeleting: false,
  isClearing: false,
  todoError: null,
};

export const StateContext = React.createContext(initialState);
export const DispatchContext = React.createContext<React.Dispatch<Action>>(
  () => {},
);

type Props = {
  children: React.ReactNode;
};

export const TodoAppContext: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch(actionCreator.clearError());
    todoService.getTodos(USER_ID)
      .then(todos => dispatch(actionCreator.load(todos)))
      .catch(() => {
        dispatch(actionCreator.addError(TodoError.ErrorLoad));
      });
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};
