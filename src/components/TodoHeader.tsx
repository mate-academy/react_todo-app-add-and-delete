import React, { useEffect, useRef } from 'react';

type Props = {
  title: string;
  setTitle: (value: string) => void;
  onSubmit: () => void;
  isAdding: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  title,
  setTitle,
  onSubmit,
  isAdding,
}) => {
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleField.current?.focus();
  }, []);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all"
        data-cy="ToggleAllButton"
      />

      <form
        onSubmit={event => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <input
          disabled={isAdding}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          ref={titleField}
        />
      </form>
    </header>
  );
};
