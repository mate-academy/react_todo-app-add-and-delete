import React, { useEffect, useRef, useState } from 'react';
import { USER_ID, addTodo, deleteTodo, getTodos } from '../api/todos';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

const getFilteredTodos = (todos: Todo[], filter: Filter) => {
  switch (filter) {
    case Filter.Active:
      return todos.filter(todo => !todo.completed);
    case Filter.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isSubmitting]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = inputText.trim();

    if (!title) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = { userId: USER_ID, title, completed: false };

    setErrorMessage('');
    setIsSubmitting(true);
    setTempTodo({ ...newTodo, id: 0 });

    addTodo(newTodo)
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setInputText('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setErrorMessage('');
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => {
          return currentTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
        inputRef.current?.focus();
      });
  };

  const handleClearCompleted = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => handleDeleteTodo(todo.id));
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.length - activeTodosCount;
  const filteredTodos = getFilteredTodos(todos, filter);

  return {
    todos,
    filteredTodos,
    tempTodo,
    loadingTodoIds,
    errorMessage,
    setErrorMessage,
    filter,
    setFilter,
    inputText,
    setInputText,
    isSubmitting,
    inputRef,
    activeTodosCount,
    completedTodosCount,
    handleSubmit,
    handleDeleteTodo,
    handleClearCompleted,
  };
};
