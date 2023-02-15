import React, { useState } from 'react';
import cn from 'classnames';

type Props = {
  hasActiveTodos: number,
  isInputDisabled: boolean,
  onSubmitAddTodo: (title: string) => void,
};

export const Header: React.FC<Props> = ({
  hasActiveTodos,
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
      {/* this buttons is active only if there are some active todos */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: !hasActiveTodos,
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
