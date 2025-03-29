import { useEffect, useMemo, useState } from 'react';
import { FilterStatus } from '../types/FilterStatus';
import { Todo } from '../types/Todo';
import { deleteTodo, getTodos } from '../api/todos';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.ALL,
  );
  const [error, setError] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    setError('');
    getTodos()
      .then(data => setTodos(data))
      .catch(() => setError('Unable to load todos'));
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filterStatus) {
      case FilterStatus.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FilterStatus.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filterStatus]);

  const removeTodo = (id: number) => {
    setProcessingTodoIds(prev => [...prev, id]);

    return deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(prevTodo => prevTodo.id !== id));
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => {
        setProcessingTodoIds(prev => prev.filter(prevTodo => prevTodo !== id));
      });
  };

  const deleteAllCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    Promise.allSettled(completedTodos.map(todo => removeTodo(todo.id)));
  };

  return {
    todos,
    setTodos,
    filterStatus,
    setFilterStatus,
    error,
    setError,
    tempTodo,
    setTempTodo,
    processingTodoIds,
    filteredTodos,
    removeTodo,
    deleteAllCompletedTodos,
  };
};
