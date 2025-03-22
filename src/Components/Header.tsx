import { useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type HeaderProps = {
  todos: Todo[];
  title: string;
  setTitle: (value: string) => void;
  setError: (value: string | null) => void;
  onToggleAll: () => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<HeaderProps> = ({
  todos,
  title,
  setTitle,
  setError,
  handleSubmit,
  onToggleAll,
  loading,
  inputRef,
}) => {
  const areAllTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, [inputRef]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: areAllTodosCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
      />

      <form
        onSubmit={event => {
          event.preventDefault();
          if (!title.trim()) {
            setError('Title should not be empty');

            return;
          }

          handleSubmit(event);
        }}
      >
        <input
          ref={inputRef}
          autoFocus
          value={title}
          onChange={e => {
            setTitle(e.target.value);
            setError(null);
          }}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={loading}
        />
      </form>
    </header>
  );
};
