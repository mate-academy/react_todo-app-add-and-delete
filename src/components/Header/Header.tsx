import React, { useState } from 'react';
import cn from 'classnames';

type Props = {
  someActiveTodos: number,
  isInputDisabled: boolean,
  onSubmitAddTodo: (title: string) => void,
};

export const Header: React.FC<Props> = ({
  someActiveTodos,
  isInputDisabled,
  onSubmitAddTodo,
}) => {
  const [title, setTitle] = useState('');

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();

    onSubmitAddTodo(title);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        aria-label="toggle"
        className={cn('todoapp__toggle-all', {
          active: !someActiveTodos,
        })}
      />

      <form
        onSubmit={handleAddTodo}
      >
        <input
          type="text"
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={(event) => setTitle(event.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
