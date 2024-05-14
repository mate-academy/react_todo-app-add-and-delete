import React, { useContext, useEffect, useRef, useState } from 'react';
import { ActionNames, TodoContext, errors } from './TodoContext';
import { Todo } from '../types/Todo';
import { USER_ID, createTodo } from '../api/todos';

export const TEMP_USER_ID = 0;

export const Header: React.FC = () => {
  const { todos, dispatch, handleError, tmpTodo, handleTmpTodo } =
    useContext(TodoContext);
  const [value, setValue] = useState('');
  const [disabled, setDisabled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setValue(event.target.value);
  };

  const handleKeyDown = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!value.trim()) {
      handleError(errors.EmptyTitle);

      return;
    }

    const newTodo: Todo = {
      id: TEMP_USER_ID,
      userId: USER_ID,
      completed: false,
      title: value.trim(),
    };

    setDisabled(true);

    handleTmpTodo(newTodo);

    createTodo(newTodo)
      .then(nt => {
        handleTmpTodo(null);
        dispatch({ type: ActionNames.Add, payload: nt });
        setValue('');
      })
      .catch(() => {
        handleError(errors.AddTodo);
        handleTmpTodo(null);
      })
      .finally(() => setDisabled(false));
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    focusInput();
  }, [todos, tmpTodo]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleKeyDown}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={value}
          ref={inputRef}
          disabled={disabled}
          onChange={handleChange}
        />
      </form>
    </header>
  );
};
