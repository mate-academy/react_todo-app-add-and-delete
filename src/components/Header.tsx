/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import classNames from 'classnames';

interface Props {
  todoInputRef: React.RefObject<HTMLInputElement>;
  isEveryTodoCompleted: boolean;
  onAdd: (title: string) => Promise<void>;
  onToggleAll: () => void;
  disabled: boolean;
}

export const Header: React.FC<Props> = ({
  todoInputRef,
  isEveryTodoCompleted,
  onAdd,
  onToggleAll,
  disabled,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (disabled) {
      return;
    }

    const trimmedTitle = title.trim();

    onAdd(trimmedTitle)
      .then(() => {
        setTitle('');
      })
      .catch(() => {});
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isEveryTodoCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={todoInputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={disabled}
        />
      </form>
    </header>
  );
};
