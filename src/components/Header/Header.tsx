/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  onCreate: (title: string) => Promise<void>;
  onEmpty?: () => void;
  hasActiveTodos: boolean;
  onToggleAll: () => void;
  areAllCompleted: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  onCreate,
  onEmpty,
  hasActiveTodos,
  onToggleAll,
  areAllCompleted,
  inputRef,
}) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = title.trim();

    if (!trimmed) {
      onEmpty?.();
      inputRef.current?.focus();

      return;
    }

    setIsLoading(true);
    try {
      await onCreate(trimmed);
      setTitle('');
    } catch (error) {
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }

  return (
    <header className="todoapp__header">
      {hasActiveTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
