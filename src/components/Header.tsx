import React, { useEffect, useRef } from 'react';

type Props = {
  newTodoTitle: string;
  onNewTodoChange: (title: string) => void;
  isAppBusy: boolean;
  onTodoAdd: (event: React.FormEvent) => void;
};

export const Header: React.FC<Props> = ({
  newTodoTitle,
  onNewTodoChange,
  isAppBusy,
  onTodoAdd,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !isAppBusy) {
      inputRef.current.focus();
    }
  }, [isAppBusy]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onTodoAdd}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => onNewTodoChange(e.target.value)}
          disabled={isAppBusy}
        />
      </form>
    </header>
  );
};
