/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

type Props = {
  title: string,
  setTitle: (value: string) => void;
  activeTodosQuantity: number;
};

export const Header: React.FC<Props> = ({
  title,
  setTitle,
  activeTodosQuantity,
}) => (
  <header className="todoapp__header">
    <button
      type="button"
      className={classNames('todoapp__toggle-all', {
        active: activeTodosQuantity > 0,
      })}
    />

    {/* Add a todo on form submit */}
    <form>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => setTitle(event.target.value)}
      />
    </form>
  </header>
);
