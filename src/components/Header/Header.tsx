import React, { useState } from 'react';
import cn from 'classnames';

type Props = {
  hasTodos: number,
  hasActiveTodos: number,
  userId: number,
  handleAddTodo: (userId: number, title: string) => Promise<void>,
  isInputDisabled: boolean,
};

export const Header: React.FC<Props> = React.memo(({
  hasTodos,
  hasActiveTodos,
  userId,
  handleAddTodo,
  isInputDisabled,
}) => {
  const [title, setTitle] = useState('');

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAddTodo(userId, title);
    setTitle('');
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {!!hasTodos && (
        <button
          type="button"
          aria-label="toggle todos butoon"
          className={cn(
            'todoapp__toggle-all',
            { active: !hasActiveTodos },
          )}
        />
      )}

      <form
        onSubmit={handleOnSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleOnChange}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
});
