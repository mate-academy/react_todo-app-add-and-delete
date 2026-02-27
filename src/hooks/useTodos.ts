import { useState, useEffect } from 'react';
import { getTodos, addTodo, deleteTodo } from '../api/todos';
import { Todo } from '../types/Todo';

export const useTodos = (onError: (message: string) => void) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        onError('Unable to load todos');
      });
  }, [onError]);

  const handleAddTodo = async (title: string, userId: number) => {
    setIsAdding(true);
    const tempTodoo: Todo = {
      id: 0,
      userId,
      title,
      completed: false,
    };

    setTempTodo(tempTodoo);

    try {
      const newTodo = await addTodo(title);

      setTodos(prev => [...prev, newTodo]);
      setTempTodo(null);

      return newTodo;
    } catch (error) {
      setTempTodo(null);
      throw error;
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setDeletingIds(prev => [...prev, id]);
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      throw error;
    } finally {
      setDeletingIds(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setDeletingIds(completedTodos.map(todo => todo.id));
    setIsClearing(true);

    const deletePromises = completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => ({ id: todo.id, success: true }))
        .catch(() => ({ id: todo.id, success: false })),
    );

    try {
      const results = await Promise.all(deletePromises);

      const successfulIds = results
        .filter(result => result.success)
        .map(result => result.id);

      const hasError = results.some(result => !result.success);

      setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));

      if (hasError) {
        throw new Error('Unable to delete a todo');
      }
    } finally {
      setDeletingIds([]);
      setIsClearing(false);
    }
  };

  return {
    todos,
    isAdding,
    deletingIds,
    tempTodo,
    isClearing,
    handleAddTodo,
    handleDeleteTodo,
    handleClearCompleted,
  };
};
