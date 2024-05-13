import React, { useContext, useEffect, useRef, useState } from 'react';
import { ActionNames, Errors, TodoContext } from './TodoContext';
import { Todo } from '../types/Todo';
import { USER_ID, createTodo } from '../api/todos';

export const TEMP_USER_ID = -1;

export const Header: React.FC = () => {
  const { todos, dispatch, handleError } = useContext(TodoContext);
  const [value, setValue] = useState('');
  const [disabled, setDisabled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setValue(event.target.value);
  };

  const handleKeyDown = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (value.trim() === '') {
      handleError(Errors.EmptyTitle);

      return;
    }

    const newTodo: Todo = {
      id: TEMP_USER_ID,
      userId: USER_ID,
      completed: false,
      title: value.trim(),
    };

    setDisabled(true);

    dispatch({ type: ActionNames.Add, payload: newTodo });

    createTodo(newTodo)
      .then(nt => {
        dispatch({ type: ActionNames.Delete, payload: newTodo.id });
        dispatch({ type: ActionNames.Add, payload: nt });
        setValue('');
      })
      .catch(() => {
        dispatch({ type: ActionNames.Delete, payload: newTodo.id });
        handleError(Errors.AddTodo);
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
  }, [todos]);

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
          onChange={handleOnChange}
        />
      </form>
    </header>
  );
};
