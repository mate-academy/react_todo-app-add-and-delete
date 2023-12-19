import cn from 'classnames';
import React, { useEffect, useRef } from 'react';

import { ErrorType } from '../../types/ErorTypes';

type Props = {
  isAllCompleted: boolean;
  onAdd: (todoTitle: string) => void;
  onError: (error: ErrorType) => void;
  onNewTodoTitle: (title: string) => void,
  newTodoTitle: string
  isLoading: boolean,
};

export const Header: React.FC<Props> = ({
  isAllCompleted,
  onAdd,
  onError,
  onNewTodoTitle,
  newTodoTitle,
  isLoading,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newTodoTitle.trim()) {
      onAdd(newTodoTitle);
    } else {
      onError(ErrorType.TitleError);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [newTodoTitle]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: isAllCompleted })}
        data-cy="ToggleAllButton"
        aria-labelledby="button-label"
      />

      <form onSubmit={handleSubmitForm}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => onNewTodoTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
