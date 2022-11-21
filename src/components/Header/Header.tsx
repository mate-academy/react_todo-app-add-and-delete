import { FormEventHandler, LegacyRef } from 'react';
import classNames from 'classnames';
import '../../styles/index.scss';
import { Todo } from '../../types/Todo';

type Props = {
  newTodoField: LegacyRef<HTMLInputElement>;
  todos: Todo[];
  query: string;
  handleTodoCreate: FormEventHandler<HTMLFormElement>;
  setQuery: (title: string) => void;
  isTodoOnLoad: boolean;
};

export const Header: React.FC<Props> = ({
  newTodoField,
  todos,
  handleTodoCreate,
  query,
  setQuery,
  isTodoOnLoad,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
          aria-label="Toggle All"
        />
      )}

      <form onSubmit={handleTodoCreate}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className={classNames(
            'todoapp__new-todo',
          )}
          placeholder="What needs to be done?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isTodoOnLoad}
        />
      </form>
    </header>
  );
};
