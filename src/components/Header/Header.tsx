import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import React, { useEffect, useRef, useState } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  todoList: Todo[];
  onError: (value: ErrorMessage | '') => void;
  onAdd: (title: string) => Promise<void>;
  isDisabled: boolean;
};

export const Header: React.FC<Props> = ({
  todoList,
  onError,
  onAdd,
  isDisabled,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');

  const isAllCompleted =
    todoList.length > 0 && todoList.every(todo => todo.completed);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const clearTitle = title.trim();

    if (clearTitle === '') {
      onError(ErrorMessage.EmptyTitle);

      return;
    }

    onAdd(clearTitle)
      .then(() => setTitle(''))
      .catch(() => {
        // error is shown by App
      });
  };

  useEffect(() => {
    if (!isDisabled) {
      inputRef.current?.focus();
    }
  }, [isDisabled, todoList.length]);

  return (
    <header className="todoapp__header">
      {todoList.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisabled}
          ref={inputRef}
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
