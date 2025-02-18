import React, {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { FILTERS, FilterType } from '../types/Filters';
import { Todo, TodoBase } from '../types/Todo';
import { Action, ACTIONS } from '../types/Actions';
import {
  addTodo,
  renameTodo,
  deleteTodo,
  toggleTodo,
  toggleAll,
  getTodos,
} from '../api/todos';
import { useNotification } from './NotificationContext';

type State = {
  todos: Todo[];
  tempTodo: Todo | null;
  filter: FilterType;
  isLoading: boolean;
  isError: boolean;
};

type Context = {
  state: State;
  dispatch: React.Dispatch<Action>;
  handleAddTodo: (todo: TodoBase) => Promise<void>;
  handleRenameTodo: (id: number, newTitle: string) => void;
  handleDeleteTodo: (id: number) => Promise<void>;
  handleToggleTodo: (id: number, completed: boolean) => void;
  handleToggleAll: () => void;
  deletingTodoIds: number[] | null;
};

export const TodosContext = createContext<Context>({
  state: {
    todos: [],
    filter: FILTERS.ALL,
    isLoading: false,
    isError: false,
    tempTodo: null,
  },
  dispatch: () => {},
  handleAddTodo: async () => Promise.resolve(),
  handleRenameTodo: () => {},
  handleDeleteTodo: async () => Promise.resolve(),
  handleToggleTodo: () => {},
  handleToggleAll: () => {},
  deletingTodoIds: null,
});

export const todosReducer = (state: State, action: Action): State => {
  const { todos } = state;
  const { type, payload } = action;

  switch (type) {
    case ACTIONS.SET_TODOS:
      return { ...state, todos: payload };

    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: payload };

    case ACTIONS.SET_ERROR:
      return { ...state, isError: payload, isLoading: false };

    case ACTIONS.SET_TEMP_TODO:
      return { ...state, tempTodo: payload };

    case ACTIONS.REMOVE_TEMP_TODO:
      return { ...state, tempTodo: payload };

    case ACTIONS.ADD_TODO:
      return { ...state, todos: [...todos, payload] };

    case ACTIONS.RENAME_TODO: {
      const { id, title } = payload;

      return {
        ...state,
        todos: todos.map(todo => (todo.id === id ? { ...todo, title } : todo)),
      };
    }

    case ACTIONS.DELETE_TODO: {
      const { id } = payload;

      return { ...state, todos: todos.filter(todo => todo.id !== id) };
    }

    case ACTIONS.TOGGLE_TODO:
      const { id } = payload;

      return {
        ...state,
        todos: todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
      };

    case ACTIONS.TOGGLE_ALL:
      const isTodosCompleted = todos.every(todo => todo.completed);

      if (isTodosCompleted) {
        return {
          ...state,
          todos: todos.map(todo => {
            return { ...todo, completed: false };
          }),
        };
      }

      return {
        ...state,
        todos: todos.map(todo => {
          return { ...todo, completed: true };
        }),
      };

    case ACTIONS.SET_FILTER:
      return { ...state, filter: payload };

    default:
      return state;
  }
};

export const TodosProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(todosReducer, {
    todos: [],
    filter: FILTERS.ALL,
    isLoading: false,
    isError: false,
    tempTodo: null,
  });
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });

      try {
        const fetchedTodos = await getTodos();

        dispatch({ type: ACTIONS.SET_TODOS, payload: fetchedTodos });
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: true });
        showNotification('Unable to load todos');
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    };

    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddTodo = async (todo: TodoBase) => {
    const tempTodo: Todo = { ...todo, id: 0 };

    dispatch({ type: ACTIONS.SET_TEMP_TODO, payload: tempTodo });

    try {
      const createdTodo = await addTodo(todo);

      dispatch({ type: ACTIONS.ADD_TODO, payload: createdTodo });
      dispatch({ type: ACTIONS.REMOVE_TEMP_TODO, payload: null });
    } catch (error) {
      dispatch({ type: ACTIONS.REMOVE_TEMP_TODO, payload: null });
      throw error;
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setDeletingTodoIds(prev => [...prev, id]);

    try {
      await deleteTodo(id);

      dispatch({ type: ACTIONS.DELETE_TODO, payload: { id } });
    } catch (error) {
      throw error;
    } finally {
      setDeletingTodoIds(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const handleRenameTodo = async (id: number, newTitle: string) => {
    const prevTodos = state.todos;

    dispatch({
      type: ACTIONS.SET_TODOS,
      payload: prevTodos.map(todo =>
        todo.id === id ? { ...todo, title: newTitle } : todo,
      ),
    });

    try {
      await renameTodo(id, newTitle);
    } catch (error) {
      dispatch({ type: ACTIONS.SET_TODOS, payload: prevTodos });
    }
  };

  const handleToggleTodo = async (id: number, completed: boolean) => {
    const prevTodos = state.todos;

    dispatch({
      type: ACTIONS.SET_TODOS,
      payload: prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !completed } : todo,
      ),
    });

    try {
      await toggleTodo(id, completed);
    } catch (error) {
      dispatch({ type: ACTIONS.SET_TODOS, payload: prevTodos });
    }
  };

  const handleToggleAll = async () => {
    const prevTodos = state.todos;
    const allCompleted = prevTodos.every(todo => todo.completed);
    const updatedTodos = prevTodos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    dispatch({
      type: ACTIONS.SET_TODOS,
      payload: updatedTodos,
    });

    try {
      await toggleAll(prevTodos);
    } catch (error) {
      dispatch({ type: ACTIONS.SET_TODOS, payload: prevTodos });
    }
  };

  return (
    <TodosContext.Provider
      value={{
        state,
        dispatch,
        handleAddTodo,
        handleRenameTodo,
        handleDeleteTodo,
        handleToggleTodo,
        handleToggleAll,
        deletingTodoIds,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
