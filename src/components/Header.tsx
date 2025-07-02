import React from 'react';
import classNames from 'classnames';

type Props = {
  todoValue: string;
  setTodoValue: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (event: React.FormEvent) => void;
  isAdding: boolean;
  allCompleted: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  todoValue,
  setTodoValue,
  handleSubmit,
  isAdding,
  allCompleted,
  inputRef,
}) => (
  <header className="todoapp__header">
    <button
      type="button"
      className={classNames('todoapp__toggle-all', {
        active: allCompleted,
      })}
      data-cy="ToggleAllButton"
    />

    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onChange={e => setTodoValue(e.target.value)}
        value={todoValue}
        autoFocus
        disabled={isAdding}
      />
    </form>
  </header>
);
