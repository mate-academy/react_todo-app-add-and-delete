import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  todos: Todo[];
  addTodo: (title: string) => void;
  setErrorMessege: (errorMessage: ErrorMessage) => void;
  isLoading: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  addTodo,
  setErrorMessege,
  isLoading,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isAllCompleted = todos.every((todo) => todo.completed);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading]);

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessege(ErrorMessage.TITLE_SHOULD_NOT_BE_EMPTY);
      setTitle('');

      return;
    }

    addTodo(title.trim());
    setTitle('');
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {todos.length > 0 && (
        <>
          {/* eslint-disable-next-line */}
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: isAllCompleted,
            })}
            data-cy="ToggleAllButton"
          />
        </>
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
