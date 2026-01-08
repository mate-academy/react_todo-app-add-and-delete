import { useState, useEffect, useMemo, useRef } from 'react';
import * as todosApi from '../api/todos';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';
import { ErrorMessage } from '../types/ErrorMessage';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | ''>('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingTodo, setDeletingTodo] = useState<number | null>(null);
  const todoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTodos = async () => {
      setErrorMessage('');

      try {
        const loadedTodos = await todosApi.getTodos();

        setTodos(loadedTodos);
      } catch {
        setErrorMessage(ErrorMessage.Load);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (todoInput.current) {
      todoInput.current.focus();
    }
  }, [todos, tempTodo]);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [errorMessage]);

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const hasCompletedTodos = useMemo(
    () => todos.filter(todo => todo.completed).length > 0,
    [todos],
  );

  const isEveryTodoCompleted = useMemo(
    () => todos.length > 0 && todos.every(todo => todo.completed),
    [todos],
  );

  const filteredTodos = useMemo(() => {
    if (filter === Filter.Active) {
      return todos.filter(todo => !todo.completed);
    }

    if (filter === Filter.Completed) {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  }, [todos, filter]);

  const handleAddTodo = async (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.Title);

      throw new Error();
    }

    setErrorMessage('');
    setIsAdding(true);
    setTempTodo({
      id: 0,
      userId: todosApi.USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    try {
      const newTodo = await todosApi.addTodo({
        userId: todosApi.USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch {
      setErrorMessage(ErrorMessage.Add);
      throw new Error();
    } finally {
      setIsAdding(false);
      setTempTodo(null);
    }
  };

  const handleTodoStatusChange = async (
    todoId: number,
    currentCompleted: boolean,
  ) => {
    setErrorMessage('');

    try {
      const updatedTodo = await todosApi.updateTodo(todoId, !currentCompleted);

      setTodos(previousTodos =>
        previousTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );
    } catch {
      setErrorMessage(ErrorMessage.Update);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setErrorMessage('');
    setDeletingTodo(todoId);

    try {
      await todosApi.deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(ErrorMessage.Delete);
    } finally {
      setDeletingTodo(null);
    }
  };

  const handleClearCompleted = async () => {
    setErrorMessage('');

    const completedTodos = todos.filter(todo => todo.completed);

    const results = await Promise.allSettled(
      completedTodos.map(todo => todosApi.deleteTodo(todo.id)),
    );

    const successfulDeletedTodos: number[] = [];

    completedTodos.forEach((todo, index) => {
      if (results[index].status === 'fulfilled') {
        successfulDeletedTodos.push(todo.id);
      }
    });

    const rejectedCount = results.filter(
      result => result.status === 'rejected',
    ).length;
    const hasErrors = rejectedCount > 0;

    setTodos(previousTodos =>
      previousTodos.filter(todo => !successfulDeletedTodos.includes(todo.id)),
    );

    if (hasErrors) {
      setErrorMessage(ErrorMessage.Delete);
    }
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);

    const todosToUpdate = allCompleted
      ? todos
      : todos.filter(todo => !todo.completed);

    try {
      await Promise.all(
        todosToUpdate.map(todo => todosApi.updateTodo(todo.id, !allCompleted)),
      );

      setTodos(prevTodos =>
        prevTodos.map(todo => ({ ...todo, completed: !allCompleted })),
      );
    } catch {
      setErrorMessage(ErrorMessage.Update);
    }
  };

  return {
    todos,
    errorMessage,
    setErrorMessage,
    filter,
    setFilter,
    tempTodo,
    isAdding,
    deletingTodo,
    todoInput,
    activeTodosCount,
    hasCompletedTodos,
    isEveryTodoCompleted,
    filteredTodos,
    handleAddTodo,
    handleTodoStatusChange,
    handleDeleteTodo,
    handleClearCompleted,
    handleToggleAll,
  };
};
