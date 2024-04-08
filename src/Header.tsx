import React, { useEffect } from 'react';
import { Todo } from './types/Todo';

interface Props {
  inputRef: React.RefObject<HTMLInputElement>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  tempTodo: Todo | null;
  isDisabled: boolean;
  titleText: string;
  onType: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export const Header: React.FC<Props> = ({
  inputRef,
  onSubmit,
  tempTodo,
  isDisabled,
  titleText,
  onType,
}) => {
  useEffect(() => {
    inputRef.current?.focus();
  }, [tempTodo]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          ref={inputRef}
          type="text"
          disabled={isDisabled}
          value={titleText}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={onType}
        />
      </form>
    </header>
  );
};
