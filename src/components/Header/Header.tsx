import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

type Props = {
  todosLength: number;
  allCompleted: boolean;
  onAddTodo: (title: string) => Promise<void>;
  isSubmitting: boolean;
};

export const Header: React.FC<Props> = ({
  todosLength,
  allCompleted,
  onAddTodo,
  isSubmitting,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isSubmitting]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      onAddTodo('');

      return;
    }

    try {
      onAddTodo(trimmedTitle).then(() => {
        setTitle('');
      });
    } finally {
      inputRef.current?.focus();
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todosLength > 0 && allCompleted,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
        <button type="submit" style={{ display: 'none' }} />
      </form>
    </header>
  );
};
