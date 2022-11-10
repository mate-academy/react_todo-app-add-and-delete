import React from 'react';
import classNames from 'classnames';

type Props = {
  allComplited: boolean,
  selectAllTodos: () => void,
  createTodo: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
  newTodoTitle: string,
  onNewTodoTitle: (value: string) => void
};

export const Header:React.FC<Props> = React.memo(({
  allComplited,
  selectAllTodos,
  createTodo,
  newTodoTitle,
  onNewTodoTitle,
}) => {
  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allComplited,
        })}
        onClick={selectAllTodos}
        aria-label="button-select ALL"
      />

      <form
        onSubmit={createTodo}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          value={newTodoTitle}
          onChange={event => onNewTodoTitle(event.target.value)}
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
});
