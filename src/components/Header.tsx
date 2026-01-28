import React from 'react';
import cn from 'classnames';

type Props = {
  allTodosIsComplited: boolean;
  title: string;
  setTitle: (value: string) => void;
  inputField: React.RefObject<HTMLInputElement>;
  loading: boolean;
  handleSubmit: (event: React.FormEvent) => void;
};

export const Header: React.FC<Props> = ({
  allTodosIsComplited,
  title,
  setTitle,
  inputField,
  loading,
  handleSubmit,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: allTodosIsComplited })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputField}
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
