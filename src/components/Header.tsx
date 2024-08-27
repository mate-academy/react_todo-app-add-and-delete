import React from 'react';
import { useEffect, useRef } from 'react';

type Props = {
  addTodo: (todoTitle: string) => void;
  title: string;
  setTitle: (title: string) => void;
  isLoading: boolean;
};

export const Header: React.FC<Props> = ({
  addTodo,
  title,
  setTitle,
  isLoading,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(title);
  };

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          disabled={isLoading}
          value={title}
          onChange={handleTitle}
        />
      </form>
    </header>
  );
};
