import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { addTodos, deleteTodos, getTodos } from '../api/todos';
import { ErrorType } from '../types/enums';
import { LoadingTypes } from '../types/Loading';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [currentError, setCurrentError] = useState<ErrorType | ''>('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState<LoadingTypes>({
    todos: false,
    add: false,
    deletedId: null,
  });

  const handleChangeLoading = <K extends keyof LoadingTypes>(
    key: K,
    value: LoadingTypes[K],
  ) => {
    setIsLoading(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!currentError) {
      return;
    }

    const timer = setTimeout(() => {
      setCurrentError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentError]);

  useEffect(() => {
    if (
      !isLoading.add &&
      !isLoading.todos &&
      !isLoading.deletedId &&
      inputRef.current
    ) {
      inputRef.current.focus();
    }
  }, [isLoading.add, isLoading.todos, isLoading.deletedId]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        handleChangeLoading('todos', true);
        const data: Todo[] = await getTodos();

        setTodos(data);
      } catch (error) {
        setCurrentError(ErrorType.Load);
      } finally {
        handleChangeLoading('todos', false);
      }
    };

    loadTodos();
  }, []);

  const handleAddTodo = async (
    title: string,
    setSearchQuery: (value: string) => void,
  ) => {
    const newTodo: Todo = {
      id: 0,
      userId: 3349,
      title: title.trim(),
      completed: false,
    };

    if (title.trim() === '') {
      setCurrentError(ErrorType.EmptyTitle);

      return;
    }

    handleChangeLoading('add', true);
    setTempTodo(newTodo);
    try {
      const result = await addTodos(newTodo);

      setTodos(prev => [...prev, result]);
      setTempTodo(null);
      setSearchQuery('');
    } catch (error) {
      setCurrentError(ErrorType.Add);
      setTempTodo(null);
    } finally {
      handleChangeLoading('add', false);
      if (inputRef.current && !inputRef.current.disabled) {
        inputRef.current.focus();
      }
    }
  };

  const handleDeleteTodos = async (todoId: number) => {
    handleChangeLoading('deletedId', todoId);
    try {
      await deleteTodos(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (error) {
      setCurrentError(ErrorType.Delete);
    } finally {
      handleChangeLoading('deletedId', null);
    }
  };

  const handleDeleteAllTodos = async () => {
    try {
      const completedTodos = todos.filter(todo => todo.completed);

      await Promise.all(completedTodos.map(item => handleDeleteTodos(item.id)));
    } catch (error) {
      setCurrentError(ErrorType.Delete);
    }
  };

  return {
    todos,
    setTodos,
    isLoading,
    setCurrentError,
    currentError,
    handleAddTodo,
    inputRef,
    tempTodo,
    handleDeleteTodos,
    handleDeleteAllTodos,
    handleChangeLoading,
    setTempTodo,
  };
};
