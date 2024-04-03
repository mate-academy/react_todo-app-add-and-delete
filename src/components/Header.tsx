import React, { useEffect, useRef } from 'react';
import cn from 'classnames';

interface Props {
  onAddTodo: (e: React.FormEvent) => void;
  isAllCompleted: boolean;
  todosLength: number;
  fieldQuery: string;
  setFieldQuery: (fieldQuery: string) => void;
  isLoading: boolean;
  isFocusInput: boolean;
}

const Header: React.FC<Props> = ({
  onAddTodo,
  isAllCompleted,
  todosLength,
  fieldQuery,
  setFieldQuery,
  isLoading,
  isFocusInput,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (isFocusInput) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  return (
    <header className="todoapp__header">
      {todosLength > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form
        onSubmit={e => {
          e.preventDefault();
          onAddTodo(e);
        }}
      >
        <input
          disabled={isLoading}
          value={fieldQuery}
          onChange={event => setFieldQuery(event.target.value)}
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};

export default Header;
