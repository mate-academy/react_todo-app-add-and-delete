import { useState, useCallback, useEffect } from 'react';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
  USER_ID,
} from '../api/todos';

export const useTodos = (filter: FilterType) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const loadTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      const loadedTodos = await getTodos();

      setTodos(loadedTodos);
    } catch (error) {
      setErrorMessage('Unable to load todos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleSubmit = useCallback(async (title: string) => {
    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return false;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({ ...newTodo, id: 0 });
    setIsLoading(true);

    try {
      const addedTodo = await addTodo(newTodo);

      setTodos(prev => [...prev, addedTodo]);

      return true;
    } catch (error) {
      setErrorMessage('Unable to add a todo');

      return false;
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (todoId: number) => {
    setLoadingTodos(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));

      return true;
    } catch (error) {
      setErrorMessage('Unable to delete a todo');

      return false;
    } finally {
      setLoadingTodos(prev => prev.filter(id => id !== todoId));
    }
  }, []);

  const handleToggle = useCallback(
    async (todoId: number) => {
      setLoadingTodos(prev => [...prev, todoId]);

      try {
        const todo = todos.find(t => t.id === todoId);

        if (todo) {
          const updatedTodo = await updateTodo(todoId, {
            ...todo,
            completed: !todo.completed,
          });

          setTodos(prev => prev.map(t => (t.id === todoId ? updatedTodo : t)));
        }
      } catch (error) {
        setErrorMessage('Unable to update a todo');
      } finally {
        setLoadingTodos(prev => prev.filter(id => id !== todoId));
      }
    },
    [todos],
  );

  const handleUpdate = useCallback(
    async (todoId: number, newTitle: string) => {
      setLoadingTodos(prev => [...prev, todoId]);

      try {
        const todo = todos.find(t => t.id === todoId);

        if (todo) {
          const updatedTodo = await updateTodo(todoId, {
            ...todo,
            title: newTitle,
          });

          setTodos(prev => prev.map(t => (t.id === todoId ? updatedTodo : t)));
        }
      } catch (error) {
        setErrorMessage('Unable to update a todo');
      } finally {
        setLoadingTodos(prev => prev.filter(id => id !== todoId));
      }
    },
    [todos],
  );

  const handleClearCompleted = useCallback(async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setLoadingTodos(completedTodos.map(todo => todo.id));

    try {
      const results = await Promise.allSettled(
        completedTodos.map(todo => deleteTodo(todo.id)),
      );

      const successfulDeletions = results
        .map((result, index) =>
          result.status === 'fulfilled' ? completedTodos[index].id : null,
        )
        .filter((id): id is number => id !== null);

      setTodos(prev =>
        prev.filter(todo => !successfulDeletions.includes(todo.id)),
      );

      if (results.some(result => result.status === 'rejected')) {
        setErrorMessage('Unable to delete a todo');

        return false;
      }

      return true;
    } catch (error) {
      setErrorMessage('Unable to delete a todo');

      return false;
    } finally {
      setLoadingTodos([]);
    }
  }, [todos]);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  return {
    todos: filteredTodos,
    isLoading,
    tempTodo,
    loadingTodos,
    errorMessage,
    setErrorMessage,
    loadTodos,
    handleSubmit,
    handleDelete,
    handleToggle,
    handleUpdate,
    handleClearCompleted,
    activeTodosCount,
    completedTodosCount,
    hasTodos: todos.length > 0,
  };
};
