import React, { RefObject, useState } from 'react';
import { ErrorMessageType } from '../constants/ErrorMessageType';
import { USER_ID } from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  onSubmit: (newTodo: Omit<Todo, 'id'>) => Promise<void>;
  handleError: (error: ErrorMessageType) => void;
  inputRef: RefObject<HTMLInputElement>;
  loading: boolean;
};

const DEFAULT_COMPLETED = false;

export const Header: React.FC<Props> = ({
  onSubmit,
  handleError,
  inputRef,
  loading,
}) => {
  const [todoInput, setTodoInput] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    handleError(ErrorMessageType.None);

    const prepearedInputValue = todoInput.trim();

    if (!prepearedInputValue) {
      handleError(ErrorMessageType.EmptyTitle);

      return;
    }

    onSubmit({
      title: prepearedInputValue,
      completed: DEFAULT_COMPLETED,
      userId: USER_ID,
    }).then(() => setTodoInput(''));
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
          ref={inputRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoInput}
          onChange={e => setTodoInput(e.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
