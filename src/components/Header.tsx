/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void,
  title: string,
  setTitle: (event:string) => void,
  loading: boolean,
  todos: Todo[],
  errorLoad: string,
};

export const Header: React.FC <Props> = ({
  handleSubmit,
  title,
  setTitle,
  loading,
  todos,
  errorLoad,
}) => {
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos, errorLoad]);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleSubmit}
      >
        <input
          disabled={loading}
          ref={titleField}
          onChange={handleTitleChange}
          value={title}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
