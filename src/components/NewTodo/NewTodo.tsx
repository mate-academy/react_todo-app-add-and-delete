import classNames from 'classnames';
import {
  FC,
} from 'react';

import { Props } from './NewTodo.props';

export const NewTodo: FC<Props> = ({
  query,
  todos,
  setQuery,
  newTodoField,
  onAddTodo,
  isTodoLoaded,
}) => {
  return (
    <header className="todoapp__header">
      {todos && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          aria-label="Toggle"
          className={classNames(
            'todoapp__toggle-all',
            { active: todos.filter(todo => todo.completed) },
          )}
        />
      )}

      <form onSubmit={onAddTodo}>
        <input
          disabled={isTodoLoaded}
          data-cy="NewTodoField"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
