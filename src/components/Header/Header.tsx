import React from 'react';
import classNames from 'classnames';
import { HeaderProps } from '../../types/HeaderProps';

export const Header: React.FC<HeaderProps> = ({
  todos,
  handleNewTodoFormSubmit,
  newTodoTitle,
  setNewTodoTitle,
  newTodoInput,
  isSending,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed) && todos.length > 0,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleNewTodoFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={newTodoInput}
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value)}
          disabled={isSending}
        />
      </form>
    </header>
  );
};
