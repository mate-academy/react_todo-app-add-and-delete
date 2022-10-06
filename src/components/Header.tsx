import classNames from 'classnames';
import React, { FormEventHandler } from 'react';

type Props = {
  activeTodos: boolean;
  newTodoField: React.RefObject<HTMLInputElement>;
  title: string,
  setTitle: (param: string) => void,
  handleTodos: FormEventHandler<HTMLFormElement>;
};

export const Header: React.FC<Props> = ({
  activeTodos,
  newTodoField,
  title,
  setTitle,
  handleTodos,
}) => {
  return (
    <header className="todoapp__header">
      <button
        aria-label="active"
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all active',
          { active: activeTodos },
        )}
      />

      <form onSubmit={handleTodos}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value.trim())}
        />
      </form>
    </header>
  );
};
