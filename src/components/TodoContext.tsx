import React from 'react';
import { Todo } from '../types/Todo';
import { Filter, FILTER_ALL } from '../types/Filter';
import * as postService from '../api/todos';

type TodoContextType = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  editingTitle: string;
  setEditingTitle: React.Dispatch<React.SetStateAction<string>>;
  editingId: number | null;
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
  deleteTodo: (id: number) => void;
  clearCompletedTodos: () => void;
  shouldFocus: boolean;
  setShouldFocus: React.Dispatch<React.SetStateAction<boolean>>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TodoContext = React.createContext<TodoContextType | null>(null);

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  React.useEffect(() => {
    const fetchTodos = async () => {
      try {
        const loaded = await postService.getTodos();

        setTodos(loaded || []);
      } catch {
        setTodos([]);
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    };

    fetchTodos();
  }, []);
  const [filter, setFilter] = React.useState<Filter>(FILTER_ALL);
  const [shouldFocus, setShouldFocus] = React.useState<boolean>(false);
  const [editingTitle, setEditingTitle] = React.useState<string>('');
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const deleteTodo = async (id: number) => {
    try {
      await postService.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage('Unable to delete a todo');
      setTimeout(() => setErrorMessage(''), 3000);
      setTodos(prev =>
        prev.map(todo => (todo.id === id ? { ...todo, loading: false } : todo)),
      );
    } finally {
      setTimeout(() => {
        setShouldFocus(true);
      }, 0);
    }
  };

  const clearCompletedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setTodos(prev =>
      prev.map(todo => (todo.completed ? { ...todo, loading: true } : todo)),
    );

    const results = await Promise.allSettled(
      completedTodos.map(todo => postService.deleteTodo(todo.id)),
    );

    const failedIds = completedTodos
      .filter((_, index) => results[index].status === 'rejected')
      .map(todo => todo.id);

    if (failedIds.length > 0) {
      setErrorMessage('Unable to delete a todo');

      setTimeout(() => setErrorMessage(''), 3000);
    }

    setTodos(prev =>
      prev
        .filter(todo => !todo.completed || failedIds.includes(todo.id))
        .map(todo =>
          failedIds.includes(todo.id) ? { ...todo, loading: false } : todo,
        ),
    );

    setTimeout(() => {
      setShouldFocus(true);
    }, 0);
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        setTodos,
        filter,
        setFilter,
        editingTitle,
        setEditingTitle,
        editingId,
        setEditingId,
        deleteTodo,
        shouldFocus,
        setShouldFocus,
        errorMessage,
        setErrorMessage,
        loading,
        setLoading,
        clearCompletedTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
