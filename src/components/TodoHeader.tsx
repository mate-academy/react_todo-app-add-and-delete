import React from 'react';
import classNames from 'classnames';

type Props = {
  allCompleted: boolean;
  handleSubmit: (event: React.FormEvent) => void;
  title: string;
  setTitle: (value: string) => void;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoHeader: React.FC<Props> = ({
  allCompleted,
  handleSubmit,
  title,
  setTitle,
  isAdding,
  inputRef,
}) => {
  return (
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
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isAdding}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
