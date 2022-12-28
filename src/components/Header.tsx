import React, { useEffect, useRef } from 'react';

type Props = {
  title: string;
  onTitleChange:(title: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isAdding: boolean;
};

export const Header: React.FC<Props> = ({
  title,
  onTitleChange,
  onSubmit,
  isAdding,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        aria-label="Toggle All"
      />

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => onTitleChange(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
