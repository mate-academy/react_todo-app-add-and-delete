/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { ErrorType } from '../types/ErrorType';
import { TodoContext } from './TodoContext';
import { USER_ID } from '../utils/UserId';

export const TodoHeader: React.FC = () => {
  const [title, setTitle] = useState('');
  const {
    addTodo, setError, isLoading, setIsLoading,
  } = useContext(TodoContext);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError(ErrorType.EmptyTitle);

      return;
    }

    addTodo({
      userId: USER_ID, title: title.trim(), completed: false,
    })
      .then(() => setTitle(''))
      .finally(() => setIsLoading(false));
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={!!isLoading}
          ref={inputRef}
          value={title}
          onChange={(handleTitleChange)}
        />
      </form>
    </header>
  );
};
