import React, { useEffect, useRef } from 'react';

interface Props {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
  isSubmitting: boolean,
  newTodoTitle: string,
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

export const Header: React.FC<Props> = ({
  handleSubmit,
  isSubmitting,
  newTodoTitle,
  handleInputChange,
}) => {
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  });

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="Add new todo"
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          name="titleInput"
          value={newTodoTitle}
          disabled={isSubmitting}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};
