import React from 'react';
import classNames from 'classnames';

type Props = {
  hasTodos: boolean;
  allTodosCompleted: boolean;
  title: string;
  isDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onTitleChange: (title: string) => void;
  onAdd: (title: string) => Promise<void>;
};

export const Header: React.FC<Props> = ({
  hasTodos,
  allTodosCompleted,
  title,
  isDisabled,
  inputRef,
  onTitleChange,
  onAdd,
}) => (
  <header className="todoapp__header">
    {hasTodos && (
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allTodosCompleted,
        })}
        data-cy="ToggleAllButton"
        aria-label="Toggle all todos"
        disabled
      />
    )}

    <form
      onSubmit={event => {
        event.preventDefault();
        void onAdd(title.trim());
      }}
    >
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        aria-label="New todo title"
        value={title}
        disabled={isDisabled}
        onChange={event => onTitleChange(event.target.value)}
      />
    </form>
  </header>
);
