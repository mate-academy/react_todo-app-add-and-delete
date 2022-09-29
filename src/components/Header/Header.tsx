import React from 'react';
import classNames from 'classnames';

type Props = {
  isLeftActiveTodos: boolean;
  newTodoField: React.RefObject<HTMLInputElement>,
};

export const Header: React.FC<Props> = ({
  isLeftActiveTodos,
  newTodoField,
}) => {
  return (
    <header className="todoapp__header">
      <button
        aria-label="active"
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isLeftActiveTodos },
        )}
      />

      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
