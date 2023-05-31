import { useCallback, useEffect, useState } from 'react';
import { TodoType } from '../types/Todo';
import { deleteTodo, getTodos, postTodo } from '../api/todos';

export const useTodos = (userId: number) => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [tempTodo, setTempTodo] = useState<TodoType | null>(null);
  const [error, setError] = useState('');

  const showError = useCallback((errorMsg: string) => {
    setError(errorMsg);

    setTimeout(() => setError(''), 3000);
  }, []);

  useEffect(() => {
    if (userId) {
      getTodos(userId)
        .then((data) => setTodos(data))
        .catch(() => showError('Unable to load todos'));
    }
  }, []);

  const handleAddTodo = useCallback((title: string) => {
    if (!title) {
      showError("Title can't be empty");

      return;
    }

    const body = {
      title,
      userId,
      completed: false,
    };

    setTempTodo({
      ...body,
      id: 0,
    });

    postTodo(userId, body)
      .then(todo => setTodos((prevState) => [...prevState, todo]))
      .catch(() => showError('Unable to add a todo'))
      .finally(() => setTempTodo(null));
  }, [userId]);

  const handleDeleteTodo = useCallback((todoId: number) => {
    deleteTodo(todoId)
      .then(() => setTodos(
        prevState => prevState.filter((todo) => todo.id !== todoId),
      ))
      .catch(() => showError('Unable to delete a todo'));
  }, []);

  const handleClearCompleted = useCallback(
    async (completedTodos: TodoType[]) => {
      try {
        await Promise.all(completedTodos.map(({ id }) => handleDeleteTodo(id)));
      } catch {
        showError('Unable to clear all completed Todos');
      }
    }, [],
  );

  return {
    todos,
    tempTodo,
    error,
    handleAddTodo,
    handleDeleteTodo,
    handleClearCompleted,
  };
};
