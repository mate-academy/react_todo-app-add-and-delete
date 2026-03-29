import React from 'react';
import cn from 'classnames';

type Props = {
  isAllCompleted: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  handleAddTodo: (event: React.FormEvent) => void;
  isAdding: boolean;
  inputValue: string;
  setInputValue: (event: string) => void;
};

export const Header: React.FC<Props> = ({
  isAllCompleted,
  inputRef,
  handleAddTodo,
  isAdding,
  inputValue,
  setInputValue,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: isAllCompleted })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleAddTodo}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          disabled={isAdding}
          onChange={event => setInputValue(event.target.value)}
          data-cy="NewTodoField"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
