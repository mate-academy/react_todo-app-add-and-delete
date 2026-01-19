import React from 'react';
import classNames from 'classnames';
import { NewTodo } from '../NewTodo';

type Props = {
  areTodosCompleted: boolean;
  onSubmit: (newTitle: string, completed?: boolean) => Promise<void>;
  disabled: boolean;
  onErrorInput: () => void;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  areTodosCompleted,
  onSubmit,
  disabled,
  onErrorInput,
  onToggleAll,
}) => {
  const handleToggleAll = () => {
    onToggleAll();
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: areTodosCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={handleToggleAll}
      />

      {/* Add a todo on form submit */}
      <NewTodo
        onSubmit={onSubmit}
        disabled={disabled}
        onErrorInput={onErrorInput}
      />
    </header>
  );
};
