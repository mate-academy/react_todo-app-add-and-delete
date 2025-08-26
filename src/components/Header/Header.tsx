import cn from 'classnames';
import { useEffect, useRef } from 'react';

type Props = {
  areAllCompleted: boolean;
  adding: boolean;
  loading: boolean;
  query: string;
  onQueryChange?: (newQuery: string) => void;
  onNewTodo?: (title: string) => void;
  onCompleteToggle?: () => void;
};

export const Header: React.FC<Props> = ({
  areAllCompleted,
  adding,
  loading,
  query,
  onQueryChange = () => {},
  onNewTodo = () => {},
  onCompleteToggle = () => {},
}) => {
  const inputElement = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onNewTodo(query.trim());
  };

  useEffect(() => {
    if (adding || loading) {
      inputElement.current?.blur();
    } else {
      inputElement.current?.focus();
    }
  }, [loading, adding]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: areAllCompleted })}
        data-cy="ToggleAllButton"
        onClick={() => onCompleteToggle()}
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputElement}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => onQueryChange(event.target.value)}
          disabled={adding}
        />
      </form>
    </header>
  );
};
