import React, {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from 'react';

import { ErrorType, Todo, TodoBase } from '../model/types';

import { Action, ACTIONS } from '../model/actions';

import { initialState, todosReducer, TodosState } from '../model/reducer';

import {
  createTodo,
  renameTodo,
  deleteTodo,
  toggleTodo,
  toggleAll,
  getTodos,
} from '../api/todos';

import { useNotification } from '../contexts/NotificationContext';

type TodosContextType = {
  state: TodosState;
  handleAddTodo: (todo: TodoBase) => Promise<void>;
  handleDeleteTodo: (id: number) => Promise<boolean>;
  handleRenameTodo: (id: number, title: string) => Promise<void>;
  handleToggleTodo: (id: number, completed: boolean) => Promise<void>;
  handleToggleAll: () => Promise<void>;
  deletingTodoIds: number[];
  dispatch: React.Dispatch<Action>;
};

export const TodosContext = createContext<TodosContextType>({
  state: initialState,
  handleAddTodo: async () => {},
  handleDeleteTodo: async () => false,
  handleRenameTodo: async () => {},
  handleToggleTodo: async () => {},
  handleToggleAll: async () => {},
  deletingTodoIds: [],
  dispatch: () => undefined,
});

export const TodosProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(todosReducer, initialState);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });

      try {
        const fetched = await getTodos();

        dispatch({ type: ACTIONS.SET_TODOS, payload: fetched });
        dispatch({ type: ACTIONS.SET_ERROR, payload: false });
      } catch {
        dispatch({ type: ACTIONS.SET_ERROR, payload: true });
        showNotification(ErrorType.LOAD_TODOS);
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    };

    fetchTodos();
  }, [showNotification]);

  const handleAddTodo = async (todo: TodoBase) => {
    const tempTodo: Todo = { ...todo, id: 0 };

    dispatch({ type: ACTIONS.SET_TEMP_TODO, payload: tempTodo });

    try {
      const created = await createTodo(todo);

      dispatch({ type: ACTIONS.ADD_TODO, payload: created });
      dispatch({ type: ACTIONS.SET_TEMP_TODO, payload: null });
    } catch {
      dispatch({ type: ACTIONS.SET_TEMP_TODO, payload: null });
      throw new Error(ErrorType.ADD_TODO);
    }
  };

  const handleDeleteTodo = async (id: number): Promise<boolean> => {
    setDeletingTodoIds(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      dispatch({ type: ACTIONS.DELETE_TODO, payload: { id } });

      return true;
    } catch {
      return false;
    } finally {
      setDeletingTodoIds(prev => prev.filter(tid => tid !== id));
    }
  };

  const handleRenameTodo = async (id: number, title: string) => {
    const prev = state.todos;

    dispatch({
      type: ACTIONS.SET_TODOS,
      payload: prev.map(t => (t.id === id ? { ...t, title } : t)),
    });

    try {
      await renameTodo(id, title);
    } catch {
      dispatch({ type: ACTIONS.SET_TODOS, payload: prev });
      showNotification(ErrorType.UPDATE_TODO);
    }
  };

  const handleToggleTodo = async (id: number, completed: boolean) => {
    const prev = state.todos;

    dispatch({
      type: ACTIONS.TOGGLE_TODO,
      payload: { id, completed },
    });

    try {
      await toggleTodo(id, completed);
    } catch {
      dispatch({ type: ACTIONS.SET_TODOS, payload: prev });
      showNotification(ErrorType.UPDATE_TODO);
    }
  };

  const handleToggleAll = async () => {
    const prev = state.todos;
    const allCompleted = prev.every(t => t.completed);
    const updated = prev.map(t => ({ ...t, completed: !allCompleted }));

    dispatch({ type: ACTIONS.SET_TODOS, payload: updated });

    try {
      await toggleAll(prev);
    } catch {
      dispatch({ type: ACTIONS.SET_TODOS, payload: prev });
      showNotification(ErrorType.UPDATE_TODO);
    }
  };

  return (
    <TodosContext.Provider
      value={{
        state,
        handleAddTodo,
        handleDeleteTodo,
        handleRenameTodo,
        handleToggleTodo,
        handleToggleAll,
        deletingTodoIds,
        dispatch,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
