import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  onSubmit: (query: string) => Promise<boolean> | undefined;
  isDisabled: boolean;
  todos: Todo[];
  onToggleAll: () => void;
};

export const Header = ({ onSubmit, isDisabled, todos, onToggleAll }: Props) => {
  const [query, setQuery] = useState('');

  const inputReference = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputReference.current?.focus();
  }, [query, isDisabled, todos]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed === true),
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form
        onSubmit={event => {
          event.preventDefault();

          const result = onSubmit(query);

          result?.then(response => {
            if (response) {
              setQuery('');
            }
          });
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value)}
          disabled={isDisabled}
          ref={inputReference}
        />
      </form>
    </header>
  );
};
