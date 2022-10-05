import classNames from 'classnames';
import { FormEvent, RefObject } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  title: string,
  setTitle: (value: string) => void,
  newTodoField: RefObject<HTMLInputElement>,
  todos: Todo[],
  onAddTodo: (event: FormEvent) => void,
  isTodoLoaded: boolean,
};

export const Header: React.FC<Props> = ({
  title,
  setTitle,
  newTodoField,
  todos,
  onAddTodo,
  isTodoLoaded,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0
        && (
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              { active: todos.filter(todo => todo.completed) },
            )}
            aria-label="toggleButton"
          />
        )}

      <form onSubmit={onAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isTodoLoaded}
        />
      </form>
    </header>
  );
};
