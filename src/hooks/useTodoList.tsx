import { useEffect, useRef, useState } from 'react';
import { addTodo, deleteTodo, getTodos } from '../api/todos';
import { Todo } from '../types/Todo';

export const useTodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [processingTodoIds, setProcessingTodoIds] = useState<Todo['id'][]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddTodoToProcessing = (todoId: Todo['id']) => {
    setProcessingTodoIds(current => [...current, todoId]);
  };

  const handleRemoveTodoToProcessing = (todoId: Todo['id']) => {
    setProcessingTodoIds(current => current.filter(id => id !== todoId));
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const handleDeleteTodo = async (todoId: Todo['id']) => {
    handleAddTodoToProcessing(todoId);
    try {
      await deleteTodo(todoId);
      setTodos(current => current.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      handleRemoveTodoToProcessing(todoId);
      inputRef.current?.focus();
    }
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  const handleAddTodo = async ({
    userId,
    title,
    completed,
  }: Omit<Todo, 'id'>) => {
    setErrorMessage(null);

    const tempId = -Date.now();
    const tempTodo: Todo = { id: tempId, userId, title, completed };

    handleAddTodoToProcessing(tempId);
    setTodos(current => [...current, tempTodo]);

    try {
      const newTodo = await addTodo({ userId, title, completed });

      setTodos(current =>
        current.map(todo => (todo.id === tempId ? newTodo : todo)),
      );

      handleRemoveTodoToProcessing(tempId);
    } catch {
      setTodos(current => current.filter(todo => todo.id !== tempId));
      setErrorMessage('Unable to add a todo');
      handleRemoveTodoToProcessing(tempId);
      throw new Error('');
    }
  };

  return {
    todos,
    errorMessage,
    processingTodoIds,
    inputRef,
    setErrorMessage,
    handleDeleteTodo,
    handleClearCompleted,
    handleAddTodo,
  };
};
