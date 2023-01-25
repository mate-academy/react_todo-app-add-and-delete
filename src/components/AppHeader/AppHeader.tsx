/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  isAllCompleted: boolean,
  newTodoTitle: string,
  addingNewTodo: any,
  newTitle: (event: string) => void,
  isAdding: boolean,
};

export const AppHeader: React.FC<Props> = ({
  newTodoField,
  isAllCompleted,
  newTodoTitle,
  addingNewTodo,
  newTitle,
  isAdding,
}) => {
  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classNames('todoapp__toggle-all',
          { active: isAllCompleted })}
      />

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
};
