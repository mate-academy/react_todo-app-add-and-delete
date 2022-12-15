import React, { useEffect, useRef } from 'react';

import { Todo } from '../../types/Todo';
import { User } from '../../types/User';

type Props = {
  todos: Todo[],
  user: User | null,
  title: string,
  onTitleChange: React.Dispatch<React.SetStateAction<string>>,
  setError: (value: React.SetStateAction<string>) => void,
  setHasError: React.Dispatch<React.SetStateAction<boolean>>,
  onSubmit: (data: Omit<Todo, 'id'>) => Promise<void>,
  isAdding: boolean,
};

export const Header: React.FC<Props> = ({
  todos,
  user,
  title,
  onTitleChange,
  setError,
  setHasError,
  onSubmit,
  isAdding,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current && !isAdding) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user && title.trim().length) {
      onSubmit({
        title,
        userId: user.id,
        completed: false,
      });
    } else {
      setHasError(true);
      setError('Title can\'t be empty');
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0
      && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
          aria-label="all"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
