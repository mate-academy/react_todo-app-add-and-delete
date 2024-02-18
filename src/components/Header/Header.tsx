import React, { useContext } from 'react';
import classNames from 'classnames';
import { StateContext } from '../../store/State';

export const Header: React.FC = () => {
  const { todos } = useContext(StateContext);

  const isActiveButton = todos.some(({ completed }) => !completed);

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isActiveButton,
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
