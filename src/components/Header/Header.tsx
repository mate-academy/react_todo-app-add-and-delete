import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';

type Props = {
  addTodo: (newTodo: Todo) => void;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  titleTodo: string;
  setTitleTodo: React.Dispatch<React.SetStateAction<string>>;
};

export const Header: React.FC<Props> = ({
  addTodo,
  setErrorMessage,
  loading,
  titleTodo,
  setTitleTodo,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !loading) {
      inputRef.current.focus();
    }
  }, [loading]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!titleTodo.trim()) {
      setErrorMessage('Title should not be empty');
      return;
    }
    addTodo({
      id: 0,
      userId: USER_ID,
      title: titleTodo.trim(),
      completed: false,
    });
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
          value={titleTodo}
          onChange={event => {
            setTitleTodo(event.target.value);
          }}
          disabled={loading}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
