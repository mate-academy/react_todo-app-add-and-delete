import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onHandleSubmit: (inputValue: string) => void;
  isSubmitting: boolean;
  shouldClearInput: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  onHandleSubmit,
  isSubmitting,
  shouldClearInput,
}) => {
  const [inputValue, setInputValue] = React.useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [todos, isSubmitting]);

  useEffect(() => {
    if (shouldClearInput) {
      setInputValue('');
    }
  }, [todos, shouldClearInput]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onHandleSubmit(inputValue);
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
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
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          ref={inputRef}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
