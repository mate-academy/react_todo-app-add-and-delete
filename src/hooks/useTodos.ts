import { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { createTodo, deleteTodo, USER_ID } from '../api/todos';
import { client } from '../utils/fetchClient';

export const useTodos = (onError: (message: string) => void) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingId, setDeletingId] = useState<number[]>([]);

  useEffect(() => {
    client
      .get<Todo[]>(`/todos?userId=${USER_ID}`)
      .then(setTodos)
      .catch(() => onError('Unable to load todos'));
  }, [onError]);

  const addTodo = async (title: string) => {
    const trimmedTitle = title.trim();

    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    });

    try {
      const newTodo = await createTodo({
        title: trimmedTitle,
        completed: false,
        userId: USER_ID,
      });

      setTodos(prev => [...prev, newTodo]);
    } catch {
      onError('Unable to add a todo');
      throw new Error();
    } finally {
      setTempTodo(null);
    }
  };

  const removeTodo = async (todoId: number) => {
    setDeletingId(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      onError('Unable to delete a todo');
    } finally {
      setDeletingId(prev => prev.filter(id => id !== todoId));
    }
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(completedTodos.map(todo => removeTodo(todo.id)));
  };

  return {
    todos,
    tempTodo,
    deletingId,
    addTodo,
    removeTodo,
    clearCompleted,
    setTodos,
  };
};
