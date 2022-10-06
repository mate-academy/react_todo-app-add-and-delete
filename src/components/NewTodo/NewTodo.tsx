import classNames from 'classnames';
import { FC, useEffect, useRef } from 'react';

import { Props } from './NewTodo.props';

export const NewTodo: FC<Props> = ({ query, todos, setQuery }) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const uncompletedTodos = todos.filter((todo) => !todo.completed);
  const completedTodosLength = todos.length - uncompletedTodos.length;

  return (
    <header className="todoapp__header">
      {todos && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          aria-label="Toggle"
          className={classNames('todoapp__toggle-all', {
            active: completedTodosLength === todos.length,
          })}
        />
      )}

      <form>
        <input
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
