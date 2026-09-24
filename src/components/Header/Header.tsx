import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

type Props = {
  todosLength: number;
  activeCount: number;
  onAdd: (tempTitle: string) => Promise<void>;
  onError: (errorMessage: string) => void;
  inProcess: boolean;
};

export const Header: React.FC<Props> = ({
  todosLength,
  activeCount,
  onAdd,
  onError,
  inProcess,
}) => {
  const [title, setTitle] = useState('');
  const inputFocus = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (title.trim().length === 0) {
      onError('Title should not be empty');
    } else {
      try {
        await onAdd(title.trim());
        setTitle('');
      } catch {}
    }
  }

  useEffect(() => {
    if (!inProcess) {
      inputFocus.current?.focus();
    }
  }, [inProcess, todosLength]);

  return (
    <header className="todoapp__header">
      {todosLength !== 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todosLength !== 0 && activeCount === 0,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={event => handleSubmit(event)}>
        <input
          ref={inputFocus}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={inProcess}
        />
      </form>
    </header>
  );
};
