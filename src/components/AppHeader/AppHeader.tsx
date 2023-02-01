/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { memo } from 'react';

type Props = {
  lengthOfTodos: number,
  newTodoField: React.RefObject<HTMLInputElement>,
  isAllCompleted: boolean,
  newTodoTitle: string,
  addingNewTodo: (event: React.FormEvent) => void,
  newTitle: (event: string) => void,
  isAdding: boolean,
};

export const AppHeader: React.FC<Props> = memo(({
  lengthOfTodos,
  newTodoField,
  isAllCompleted,
  newTodoTitle,
  addingNewTodo,
  newTitle,
  isAdding,
}) => {
  return (
    <header className="todoapp__header">
      {lengthOfTodos !== 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames('todoapp__toggle-all',
            { active: isAllCompleted })}
        />
      )}

      <form onSubmit={addingNewTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => newTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
