import React, { useEffect } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  onAdd: (title: string) => void;
  todos: Todo[];
  isLoading: boolean;
  disabled: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  onAdd,
  todos,
  isLoading,
  disabled,
  inputValue,
  setInputValue,
  inputRef,
}) => {
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled, inputRef]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(inputValue);

    inputRef.current?.focus();
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all ${todos.every(todo => todo.completed) && `active`}`}
        data-cy="ToggleAllButton"
      />
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onFocus={() => true}
          disabled={isLoading}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
