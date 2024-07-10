import React, { useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  disable: boolean;
  todos: Todo[];
  allCompleted: boolean;
};

export const Header: React.FC<Props> = ({
  title,
  setTitle,
  handleSubmit,
  disable,
  todos,
  allCompleted,
}) => {
  const focusRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (focusRef.current && !disable) {
      focusRef.current.focus();
    }
  }, [disable, todos.length]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all ${allCompleted && 'active'}`}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          ref={focusRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={disable}
          onChange={e => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
