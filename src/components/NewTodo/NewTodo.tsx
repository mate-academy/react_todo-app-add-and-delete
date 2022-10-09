import React, { FormEvent, RefObject } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  newTodoField: RefObject<HTMLInputElement>,
  title: string,
  setTitle: (value: string) => void,
  isAdding: boolean,
  handleSubmit: (event: FormEvent) => void,
};

export const NewTodo: React.FC<Props> = React.memo(({
  todos,
  newTodoField,
  title,
  setTitle,
  isAdding,
  handleSubmit,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0
        && (
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
            aria-label="ToggleAllButton"
          />
        )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isAdding}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
});
