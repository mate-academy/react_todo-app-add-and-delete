import React, { useState, useRef } from 'react';

type Props = {
  onAdd: (title: string) => Promise<unknown> | void;
  allCompleted: boolean;
  onToggleAll: () => void;
  isAdding?: boolean;
  onInvalid?: () => void;
  registerFocus?: (fn: () => void) => void;
  showToggleAll?: boolean;
};

export const Header: React.FC<Props> = ({
  onAdd,
  allCompleted,
  onToggleAll,
  isAdding = false,
  onInvalid,
  registerFocus,
  showToggleAll = true,
}) => {
  const [todo, setTodo] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    registerFocus?.(() => {
      inputRef.current?.focus();
    });
  }, [registerFocus]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = todo.trim();

    if (!trimmed) {
      onInvalid?.();
      setTimeout(() => inputRef.current?.focus(), 0);

      return;
    }

    const p = onAdd(trimmed);

    if (p && typeof (p as Promise<unknown>).then === 'function') {
      (p as Promise<unknown>)
        .then(() => {
          setTodo('');
          setTimeout(() => inputRef.current?.focus(), 0);
        })
        .catch(() => {
          setTimeout(() => inputRef.current?.focus(), 0);
        });
    } else {
      setTodo('');
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <header className="todoapp__header">
      {showToggleAll && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
          aria-label="Toggle all todos"
          disabled={isAdding}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          ref={el => {
            inputRef.current = el;
          }}
          value={todo}
          onChange={event => setTodo(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
