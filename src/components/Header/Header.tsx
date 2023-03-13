import classNames from 'classnames';
import React, { useState } from 'react';

type Props = {
  addTodo: (title: string) => void;
  hasActive: boolean;
  isInputActive: boolean;
};

export const Header: React.FC<Props> = ({
  addTodo,
  hasActive,
  isInputActive,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addTodo(title);
    setTitle('');
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        aria-label="All"
        className={classNames(
          'todoapp__toggle-all',
          { active: !hasActive },
        )}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChangeTitle}
          disabled={!isInputActive}
        />
      </form>
    </header>
  );
};
