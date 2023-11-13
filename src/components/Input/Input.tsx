/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, { useState } from 'react';

interface Props {
  activeTodo: boolean
  addNewTodo: (string: string) => void
  displayError: (string: string) => void
}

export const Input: React.FC<Props> = ({
  activeTodo, addNewTodo, displayError,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!title) {
      displayError('Title should not be empty');

      return;
    }

    addNewTodo(trimmedTitle);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: !activeTodo })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          ref={input => input && input.focus()}
          type="text"
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
