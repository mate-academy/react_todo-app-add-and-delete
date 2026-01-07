/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

interface Props {
  todoInputRef: React.RefObject<HTMLInputElement>;
  isEveryTodoCompleted: boolean;
}

export const Header: React.FC<Props> = ({
  todoInputRef,
  isEveryTodoCompleted,
}) => (
  <header className="todoapp__header">
    <button
      type="button"
      className={classNames('todoapp__toggle-all', {
        active: isEveryTodoCompleted,
      })}
      data-cy="ToggleAllButton"
    />

    <form>
      <input
        ref={todoInputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
      />
    </form>
  </header>
);
