// import { Status } from '../types/Status';

import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  onSubmit: (todo: Todo) => Promise<void>;
  setErrorMessage: (error: ErrorMessage) => void;
  onTempTodo?: (todo: Todo | null) => void;
  tempTodo: Todo | null;
};

export const Header: React.FC<Props> = ({
  onSubmit,
  setErrorMessage,
  onTempTodo = () => {},
  tempTodo,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [tempTodo?.id]);

  const reset = () => {
    setTitle('');
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setErrorMessage(ErrorMessage.Default);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (trimmedTitle.length === 0) {
      setErrorMessage(ErrorMessage.Title_should_not_be_empty);
      onTempTodo(null);

      return;
    }

    onTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });
    onSubmit({ id: 0, userId: USER_ID, title: trimmedTitle, completed: false })
      .then(reset)
      .finally(() => {
        onTempTodo(null);
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
          value={title}
          onChange={handleTitleChange}
          autoFocus
          ref={inputRef}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
