import React from 'react';
import cn from 'classnames';

type Props = {
  allTodosCompleted: boolean;
  title: string;
  onTitleChange: (value: string) => void;
  addTodo: (title: string) => Promise<void>;
  isSubmitting: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  allTodosCompleted,
  title,
  onTitleChange,
  addTodo,
  isSubmitting,
  inputRef,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(title);
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: allTodosCompleted,
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          autoFocus
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isSubmitting}
          value={title}
          onChange={event => onTitleChange(event.target.value)}
        />
      </form>
    </header>
  );
};
