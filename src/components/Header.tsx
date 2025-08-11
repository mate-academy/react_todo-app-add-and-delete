import React, { useEffect } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  loading: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  disabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onAdd: (title: string) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  loading,
  onAdd,
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
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.length > 0 && todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
        disabled={loading}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onFocus={() => true}
          disabled={loading}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
