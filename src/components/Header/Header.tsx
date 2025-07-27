import cn from 'classnames';
import React from 'react';

interface Props {
  todoTitle: string;
  setTodoTitle: (title: string) => void;
  onSubmit: (title: string) => void;
  isInputActive: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  isAllTodosCompleted: boolean;
}

export const AppHeader: React.FC<Props> = ({
  onSubmit,
  todoTitle,
  setTodoTitle,
  isInputActive,
  inputRef,
  isAllTodosCompleted,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: isAllTodosCompleted,
        })}
        data-cy="ToggleAllButton"
      />

      <form
        onSubmit={event => {
          event.preventDefault();
          onSubmit(todoTitle.trim());
        }}
      >
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
          autoFocus
          disabled={!isInputActive}
        />
      </form>
    </header>
  );
};
