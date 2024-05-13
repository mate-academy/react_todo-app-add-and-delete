import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
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
  handleFilterBy: (type: FilterBy) => void;
  error: string | null;
  handleError: (message: string) => void;
  deleteCandidates: number[];
  handleDeleteCandidates: (ids: number[]) => void;
};

export const TodoContext = React.createContext<TodoContextType>({
  todos: [],
  originalTodos: [],
  dispatch: () => {},
  filteredBy: FilterBy.All,
  handleFilterBy: () => {},
  error: null,
  handleError: () => {},
  deleteCandidates: [],
  handleDeleteCandidates: () => {},
});

export type Props = {
  children: React.ReactNode;
};

export enum ActionNames {
  Load = 'LOAD',
  Add = 'ADD',
  Delete = 'DELETE',
  Update = 'UPDATE',
  ToggleCompleted = 'TOGGLE_COMPLETED',
  ToggleAllCompleted = 'TOGGLE_ALL_COMPLETED',
  ClearCompleted = 'CLEAR_COMPLETED',
}

type T = {
  type: ActionNames.ToggleCompleted;
  payload: { id: number; completed: boolean };
};

export type Action =
  | { type: ActionNames.Load; payload: Todo[] }
  | { type: ActionNames.Add; payload: Todo }
  | { type: ActionNames.Delete; payload: number }
  | { type: ActionNames.Update; payload: { id: number; title: string } }
  | T
  | { type: ActionNames.ToggleAllCompleted; payload: Todo[] }
  | { type: ActionNames.ClearCompleted };

export const Errors = {
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
  const [filteredBy, setFilteredBy] = useState<FilterBy>(FilterBy.All);
  const [error, setError] = useState<string | null>(null);
  const [deleteCandidates, setDeleteCandidates] = useState<number[]>([]);

  const handleError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
  };

  const handleFilterBy = useCallback((type: FilterBy) => {
    setFilteredBy(type);
  }, []);

  const handleDeleteCandidates = (ids: number[]) => {
    setDeleteCandidates(prev => [...prev, ...ids]);
  };

  const value = useMemo(
    () => ({
      todos: filter(todos, filteredBy),
      originalTodos: todos,
      dispatch,
      filteredBy,
      handleFilterBy,
      error,
      handleError,
      deleteCandidates,
      handleDeleteCandidates,
    }),
    [todos, dispatch, filteredBy, handleFilterBy, error, deleteCandidates],
  );

  useEffect(() => {
    if (deleteCandidates.length) {
      deleteCandidates.forEach(id => {
        deleteTodo(id)
          .then(() => {
            dispatch({ type: ActionNames.Delete, payload: id });
          })
          .catch(() => handleError(Errors.DeleteTodo));
      });
    }
  }, [deleteCandidates]);

  useEffect(() => {
    getTodos()
      .then(loadedTodos =>
        dispatch({ type: ActionNames.Load, payload: loadedTodos }),
      )
      .catch(() => {
        handleError(Errors.LoadTodos);
      });
  }, []);

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
