import { memo, useRef, useEffect } from 'react';
import { ErrorType } from '../types/errors-enum';

interface Props {
  onTitle: (e: React.ChangeEvent<HTMLInputElement>) => void,
  title: string,
  onCreateTodo: () => void,
  onError: (error: ErrorType.emptyInput) => void,
  isLoading: boolean,
}

export const Header: React.FC<Props> = memo(({
  onTitle,
  title,
  onCreateTodo,
  onError,
  isLoading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title.trim()) {
      onCreateTodo();
    } else {
      onError(ErrorType.emptyInput);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="Toggle All Button"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => onTitle(e)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
});
