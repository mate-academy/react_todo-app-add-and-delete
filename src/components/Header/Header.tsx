import React from 'react';

type Props = {
  addTodo: (title: string) => void;
  title: string;
  setTitle: (title: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isDisabled: boolean;
  isLoadingTodo: boolean;
};

export const Header: React.FC<Props> = ({
  inputRef,
  addTodo,
  title,
  setTitle,
  isDisabled,
  isLoadingTodo,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addTodo(title);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          ref={inputRef}
          disabled={isDisabled || isLoadingTodo}
        />
      </form>
    </header>
  );
};
