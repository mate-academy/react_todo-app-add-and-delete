import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  heandlSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  title: string,
  onAdd: (event: React.ChangeEvent<HTMLInputElement>) => void,
  newTodoField: React.RefObject<HTMLInputElement>,
  isAdding: boolean,
};

export const Header: React.FC<Props> = ({
  todos, heandlSubmit, title, onAdd, newTodoField, isAdding,
}) => {
  const isActive = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      <button
        aria-label="all-check"
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isActive },
        )}
      />

      <form onSubmit={heandlSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={onAdd}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
