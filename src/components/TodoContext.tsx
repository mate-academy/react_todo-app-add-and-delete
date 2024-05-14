import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo, getTodos } from '../api/todos';

export enum FilterBy {
  All = 'ALL',
  Active = 'ACTIVE',
  Completed = 'COMPLETED',
}

export type FilterAction = FilterBy.All | FilterBy.Active | FilterBy.Completed;

type TodoContextType = {
  todos: Todo[];
  originalTodos: Todo[];
  dispatch: (action: Action) => void;
  filteredBy: FilterBy;
  setFilteredBy: (type: FilterBy) => void;
  error: string | null;
  handleError: (message: string) => void;
  deleteCandidates: number[];
  handleClearCompleted: (ids: number[]) => void;
  tmpTodo: Todo | null;
  handleTmpTodo: (todo: Todo | null) => void;
};

export const TodoContext = React.createContext<TodoContextType>({
  todos: [],
  originalTodos: [],
  dispatch: () => {},
  filteredBy: FilterBy.All,
  setFilteredBy: () => {},
  error: null,
  handleError: () => {},
  deleteCandidates: [],
  handleClearCompleted: () => {},
  tmpTodo: null,
  handleTmpTodo: () => {},
});

export type Props = {
  children: React.ReactNode;
};

export enum ActionNames {
  Load = 'LOAD',
  Add = 'ADD',
  Delete = 'DELETE',
  Update = 'UPDATE',
  Completed = 'TOGGLE_COMPLETED',
  ToggleAllCompleted = 'TOGGLE_ALL_COMPLETED',
  ClearCompleted = 'CLEAR_COMPLETED',
}

export type Action =
  | { type: ActionNames.Load; payload: Todo[] }
  | { type: ActionNames.Add; payload: Todo }
  | { type: ActionNames.Delete; payload: number }
  | { type: ActionNames.Update; payload: { id: number; title: string } }
  | { type: ActionNames.Completed; payload: { id: number; completed: boolean } }
  | { type: ActionNames.ToggleAllCompleted; payload: Todo[] }
  | { type: ActionNames.ClearCompleted };

export const errors = {
  LoadTodos: 'Unable to load todos',
  EmptyTitle: 'Title should not be empty',
  AddTodo: 'Unable to add a todo',
  DeleteTodo: 'Unable to delete a todo',
  UpdateTodo: 'Unable to update a todo',
};

function reducer(state: Todo[], action: Action) {
  switch (action.type) {
    case ActionNames.Load:
      return action.payload;

    case ActionNames.Add:
      return [...state, action.payload];

    case ActionNames.Delete:
      return state.filter(todo => todo.id !== action.payload);

    case ActionNames.ClearCompleted:
      return state.filter(todo => !todo.completed);

    default:
      return state;
  }
}

function filter(todos: Todo[], type: FilterAction) {
  switch (type) {
    case FilterBy.Active:
      return todos.filter(todo => !todo.completed);

    case FilterBy.Completed:
      return todos.filter(todo => todo.completed);

    case FilterBy.All:
    default:
      return todos;
  }
}

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, dispatch] = useReducer(reducer, []);
  const [tmpTodo, setTmpTodo] = useState<Todo | null>(null);
  const [filteredBy, setFilteredBy] = useState<FilterBy>(FilterBy.All);
  const [error, setError] = useState<string | null>(null);
  const [deleteCandidates, setDeleteCandidates] = useState<number[]>([]);

  const handleError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
  };

  const handleClearCompleted = (ids: number[]) => {
    setDeleteCandidates(prev => [...prev, ...ids]);
  };

  const handleTmpTodo = (todo: Todo | null) => {
    setTmpTodo(todo);
  };

  const value = useMemo(
    () => ({
      todos: filter(todos, filteredBy),
      originalTodos: todos,
      dispatch,
      filteredBy,
      setFilteredBy,
      error,
      handleError,
      deleteCandidates,
      handleClearCompleted,
      tmpTodo,
      handleTmpTodo,
    }),
    [
      todos,
      dispatch,
      filteredBy,
      setFilteredBy,
      error,
      deleteCandidates,
      tmpTodo,
    ],
  );

  useEffect(() => {
    if (deleteCandidates.length) {
      deleteCandidates.forEach(id => {
        deleteTodo(id)
          .then(() => {
            dispatch({ type: ActionNames.Delete, payload: id });
          })
          .catch(() => handleError(errors.DeleteTodo));
      });
    }
  }, [deleteCandidates]);

  useEffect(() => {
    getTodos()
      .then(loadedTodos =>
        dispatch({ type: ActionNames.Load, payload: loadedTodos }),
      )
      .catch(() => {
        handleError(errors.LoadTodos);
      });
  }, []);

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
