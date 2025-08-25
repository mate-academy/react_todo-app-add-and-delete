import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';

type Props = {
  areAllCompleted: boolean;
  loading: boolean;
  onNewTodo?: (title: string) => Promise<void>;
  onCompleteToggle?: () => void;
};

export const Header: React.FC<Props> = ({
  areAllCompleted,
  loading,
  onNewTodo = () => Promise.resolve(),
  onCompleteToggle = () => {},
}) => {
  const [query, setQuery] = useState('');
  const inputElement = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onNewTodo(query).then(() => setQuery(''));
    inputElement.current?.blur();
  };

  useEffect(() => {
    if (!loading) {
      inputElement.current?.focus();
    }
  }, [loading]);

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
          onChange={event => setQuery(event.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
