import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';
import { ErrorType } from '../../types/ErrorType';

interface Props {
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  setErrorMessage: (value: ErrorType) => void;
  addTodo: (value: Todo) => Promise<void>;
}

export const TodoForm: React.FC<Props> = ({
  isLoading,
  inputRef,
  setErrorMessage,
  addTodo,
}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef, isLoading]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(ErrorType.TITLE);

      return;
    }

    addTodo({
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    }).then(() => setTitle(''));
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          ref={inputRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
