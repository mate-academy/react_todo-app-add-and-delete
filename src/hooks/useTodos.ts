// src/hooks/useTodos.ts
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import {
  USER_ID,
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorText } from '../types/ErrorText';
import { Filter } from '../types/Filter';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [error, setError] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [focusTrigger, setFocusTrigger] = useState(0);

  useEffect(() => {
    setError(null);

    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorText.Load));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = window.setTimeout(() => {
      setError(null);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [error]);

  const isAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const visibleTodos = useMemo(
    () =>
      todos.filter(todo => {
        switch (filter) {
          case Filter.Active:
            return !todo.completed;

          case Filter.Completed:
            return todo.completed;

          default:
            return true;
        }
      }),
    [todos, filter],
  );

  const handleFilterClick =
    (value: Filter) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setFilter(value);
    };

  const handleAdd = async (title: string): Promise<boolean> => {
    const trimmed = title.trim();

    if (!trimmed) {
      setError(ErrorText.EmptyTitle);

      return false;
    }

    setError(null);
    setIsAdding(true);

    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmed,
      completed: false,
    };

    setTempTodo(temp);

    try {
      const newTodo = await createTodo(trimmed);

      setTodos(prev => [...prev, newTodo]);
      setFocusTrigger(prev => prev + 1);

      return true;
    } catch {
      setError(ErrorText.Add);

      return false;
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const handleDelete = async (todoId: number) => {
    setDeletingIds(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      setError(ErrorText.Delete);
    } finally {
      setDeletingIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setDeletingIds(prev => [...prev, ...completedTodos.map(t => t.id)]);

    try {
      const results = await Promise.allSettled(
        completedTodos.map(todo => deleteTodo(todo.id)),
      );

      const successfulIds = completedTodos
        .filter((_, index) => results[index].status === 'fulfilled')
        .map(todo => todo.id);

      const failedIds = completedTodos
        .filter((_, index) => results[index].status === 'rejected')
        .map(todo => todo.id);

      setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));

      if (failedIds.length > 0) {
        setError(ErrorText.Delete);
      }
    } finally {
      setDeletingIds(prev =>
        prev.filter(id => !completedTodos.some(todo => todo.id === id)),
      );
    }
  };



    try {
      const updatedTodo = await updateTodo(id, { completed: !completed });

      setTodos(prev => prev.map(t => (t.id === id ? updatedTodo : t)));
    } catch {
      setError(ErrorText.Update);
    } finally {
      setDeletingIds(prev => prev.filter(x => x !== id));
    }
  };

  const hideError = () => setError(null);

  return {
    todos,
    filter,
    error,
    tempTodo,
    isAdding,
    deletingIds,
    focusTrigger,
    isAllCompleted,
    visibleTodos,
    handleFilterClick,
    handleAdd,
    handleDelete,
    handleClearCompleted,
    handleToggle,
    hideError,
  };
};
