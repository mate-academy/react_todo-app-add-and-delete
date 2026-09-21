import React from 'react';

interface Props {
  title: string;
  isAdding: boolean;
  onTitleChange: (value: string) => void;
  onSubmit: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<Props> = ({
  title,
  isAdding,
  onTitleChange,
  onSubmit,
  inputRef,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onTitleChange(event.target.value)
          }
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
