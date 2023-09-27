/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';

type Props = {
  activeTodosCount: number;
  onTodoAdd: (todoTitle: string) => Promise<void>;
};

export const Header: React.FC<Props> = ({
  activeTodosCount,
  onTodoAdd,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle) {
      //
    }

    onTodoAdd(todoTitle)
      .then(() => {
        setTodoTitle('');
      });
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {activeTodosCount > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form
        onSubmit={onFormSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={onTitleChange}
        />
      </form>
    </header>
  );
};
