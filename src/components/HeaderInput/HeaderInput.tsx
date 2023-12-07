import React, { useEffect, useRef, useState } from 'react';
import { USER_ID, useAppState } from '../AppState/AppState';
import { handleErrorMessage } from '../function/handleErrorMessage ';
import { newPost } from '../../api/todos';
import { Todo } from '../../types/Todo';

export const HeaderInput: React.FC = () => {
  const {
    todos,
    loading,
    setTodos,
    setTodosFilter,
    setErrorNotification,
    setLoading,
    setTempTodo,
  } = useAppState();

  const [newTodo, setNewTodo] = useState<string>('');

  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoFieldRef.current) {
      newTodoFieldRef.current.focus();
    }
  }, [todos]);

  const handleSaveTodo = async () => {
    if (!newTodo.trim()) {
      setErrorNotification('Title should not be empty');

      return;
    }

    setLoading(true);
    const title = newTodo.trim();

    const tempTodo: Todo = {
      id: 0,
      title,
      completed: false,
    };

    setTempTodo(tempTodo);

    try {
      const response = await newPost(USER_ID, title);

      setTodos(
        (prevTodos) => (prevTodos ? [...prevTodos, response] : [response]),
      );

      setTodosFilter(
        (prevTodos) => (prevTodos ? [...prevTodos, response] : [response]),
      );

      setNewTodo('');
    } catch (error) {
      handleErrorMessage(error as Error, setErrorNotification);
      const errorNotificationTimeout = setTimeout(() => {
        setErrorNotification(null);
      }, 3000);

      clearTimeout(errorNotificationTimeout);
      throw error;
    } finally {
      setTempTodo(null);
      setLoading(false);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="todo"
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveTodo();
        }}
      >

        <input
          ref={newTodoFieldRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={(e) => {
            setNewTodo(e.target.value);
          }}
          value={newTodo}
          disabled={loading}
        />
      </form>
    </header>
  );
};
