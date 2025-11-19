import { useCallback, useState } from 'react';
import { Todo } from '../types/Todo';
import * as todoService from '../api/todos';

interface ReturnType {
  todos: Todo[];
  isCreating: boolean;
  error: string;
  tempItem: Todo | null;
  modifyIds: number[];
  isOperationEnd: boolean;
  setError: (err: string) => void;
  addTodo: (title: string) => Promise<void>;
  removeTodo: (todoId: number) => Promise<void>;
  clearCompletedTodos: () => Promise<void>;
  getTodos: () => void;
}

export const useTodos = (): ReturnType => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [tempItem, setTempItem] = useState<Todo | null>(null);
  const [modifyIds, setModifyIds] = useState<number[]>([]);
  const [isOperationEnd, setIsOperationEnd] = useState(true);

  const clearError = () => {
    setError('');
  };

  const getTodos = useCallback(async () => {
    clearError();

    try {
      const fetchedTodos = await todoService.getTodos();

      setTodos(fetchedTodos);
    } catch (e) {
      setError('Unable to load todos');
    }
  }, []);

  const addTodo = useCallback(async (title: string) => {
    clearError();
    setIsCreating(true);
    setTempItem({
      id: 0,
      title,
      completed: false,
      userId: todoService.USER_ID,
    });

    try {
      const newTodo = await todoService.addTodo({ title, completed: false });

      setTodos(curTodos => [...curTodos, newTodo]);
    } catch (e) {
      setError('Unable to add a todo');

      throw e;
    } finally {
      setTempItem(null);
      setIsCreating(false);
    }
  }, []);

  const removeTodo = useCallback(async (todoId: number) => {
    clearError();
    setModifyIds(currentIds => [...currentIds, todoId]);
    setIsOperationEnd(false);

    try {
      await todoService.deleteTodo(todoId);
      setTodos(curTodos => curTodos.filter(todo => todo.id !== todoId));
    } catch (e) {
      setError('Unable to delete a todo');

      throw e;
    } finally {
      setModifyIds(currentIds => currentIds.filter(item => item !== todoId));
      setIsOperationEnd(true);
    }
  }, []);

  const clearCompletedTodos = useCallback(async () => {
    clearError();
    setIsOperationEnd(false);
    const completedTodosIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    if (completedTodosIds.length === 0) {
      return;
    }

    setModifyIds(curIds => [...curIds, ...completedTodosIds]);

    try {
      const result = await Promise.allSettled(
        completedTodosIds.map(todoId => todoService.deleteTodo(todoId)),
      );

      const success = completedTodosIds.filter(
        (_, index) => result[index].status === 'fulfilled',
      );
      const withError = completedTodosIds.filter(
        (_, index) => result[index].status === 'rejected',
      );

      setTodos(curTodos => curTodos.filter(todo => !success.includes(todo.id)));

      if (withError.length !== 0) {
        throw new Error('Failed deleting todos');
      }
    } catch (e) {
      setError('Unable to delete a todo');
    } finally {
      setModifyIds(curIds =>
        curIds.filter(id => !completedTodosIds.includes(id)),
      );
      setIsOperationEnd(true);
    }
  }, [todos]);

  return {
    todos,
    isCreating,
    error,
    modifyIds,
    isOperationEnd,
    setError,
    tempItem,
    addTodo,
    removeTodo,
    clearCompletedTodos,
    getTodos,
  };
};
