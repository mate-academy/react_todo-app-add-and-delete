import { useEffect, useState } from 'react';
import { getTodos, addTodo, deleteTodo, updateTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { TodoTypeError, TodoTypeErrors } from '../../types/TodoTypeErrors';
import { USER_ID } from '../../api/todos';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<TodoTypeError | null>(null);
  const [showError, setShowError] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deleteId, setDeleteId] = useState<number[]>([]);

  // get todos
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError(TodoTypeErrors.UnableToLoad);
        setShowError(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // add todo and validate
  const add = async (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(TodoTypeErrors.TitleShouldNotBeEmpty);
      setShowError(true);

      return false;
    }

    setIsLoading(true);
    setError(null);

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);

    try {
      const newTodo = await addTodo(trimmedTitle);

      setTodos(prev => [...prev, newTodo]);
      setTempTodo(null);

      return true;
    } catch {
      setError(TodoTypeErrors.UnableToAddTodo);
      setShowError(true);
      setTempTodo(null);

      return false;
    } finally {
      setIsLoading(false);
      setTempTodo(null);
    }
  };

  // delete todo and validate
  const remove = async (todoId: number) => {
    setDeleteId(id => [...id, todoId]);
    setIsLoading(true);
    setError(null);
    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      setError(TodoTypeErrors.UnableToDeleteTodo);
      setShowError(true);
    } finally {
      setDeleteId(prevIds => prevIds.filter(id => id !== todoId));
      setIsLoading(false);
    }
  };

  // toggle todo and validate
  const toggle = async (todo: Todo) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedTodo = await updateTodo(todo.id, {
        ...todo,
        completed: !todo.completed,
      });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
    } catch {
      setError(TodoTypeErrors.UnableToUpdateTodo);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const removeCompleted = async () => {
    setIsLoading(true);
    setError(null);

    const completedTodos = todos.filter(todo => todo.completed);

    for (const todo of completedTodos) {
      setDeleteId(prev => [...prev, todo.id]);

      try {
        await deleteTodo(todo.id);
        setTodos(prev => prev.filter(t => t.id !== todo.id));
      } catch {
        setError(TodoTypeErrors.UnableToDeleteTodo);
        setShowError(true);
      } finally {
        setDeleteId(prev => prev.filter(id => id !== todo.id));
      }
    }

    setIsLoading(false);
  };

  const hideError = () => {
    setShowError(false);
    setError(null);
  };

  return {
    todos,
    isLoading,
    error,
    setShowError,
    showError,
    add,
    remove,
    toggle,
    hideError,
    tempTodo,
    deleteId,
    removeCompleted,
  };
};
