import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onSubmit: (post: Todo) => void
  fixedUserId: number,
  error: (massege: string) => void,
  todo?: Todo,
  isLoading: boolean,
};

export const Header: React.FC<Props> = ({
  todos,
  onSubmit,
  fixedUserId,
  error,
  todo,
  isLoading,
}) => {
  const [title, setTitle] = useState('');
  // const [userId, setUserId] = useState(fixedUserId || 0);
  // const [completed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // const [isLo]

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim() || !fixedUserId) {
      error('Title should not be empty');
      setTimeout(() => {
        error('');
      }, 3000);

      return;
    }

    onSubmit({
      id: todo?.id || 0,
      title: title.trim(),
      completed: false,
      userId: fixedUserId,
    });

    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.some(todo1 => !todo1.completed),
        })}
        data-cy="ToggleAllButton"
        aria-label="Toggle All"
        disabled={isLoading}
      />

      {/* Add a todo on form submit */}
      <form
        method="POST"
        onSubmit={handleSubmit}
      >
        <input
          disabled={isLoading}
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
        />
      </form>
    </header>
  );
};
