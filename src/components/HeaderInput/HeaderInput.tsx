import React, { useEffect, useRef, useState } from 'react';
import { USER_ID, useAppState } from '../AppState/AppState';
import { handleErrorMessage } from '../function/handleErrorMessage ';
import { newPost } from '../../api/todos';

export const HeaderInput: React.FC = () => {
  const {
    todos,
    loading,
    setErrorNotification,
    setLoading,
    // setTodos,
    setTempTodo,
    // setFilter,
  } = useAppState();

  const [newTodo, setNewTodo] = useState<string>('');

  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoFieldRef.current) {
      newTodoFieldRef.current.focus();
    }
  }, []);

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
    let response;

    try {
      response = await newPost(
        USER_ID,
        title,
      );

      setTempTodo(response);
      setNewTodo('');
    } catch (error) {
      handleErrorMessage(error, setErrorNotification);
      const errorNotificationTimeout = setTimeout(() => {
        setErrorNotification(null);
      }, 3000);

      clearTimeout(errorNotificationTimeout);
      throw error;
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
