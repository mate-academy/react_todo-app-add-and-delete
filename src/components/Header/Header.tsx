import React, { useState } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  addNewTodo: (title: string) => void;
};

export const Header: React.FC<Props> = ({
  newTodoField,
  addNewTodo,
}) => {
  const [title, setTitle] = useState('');

  const onSumbit = async (event: React.FormEvent) => {
    event.preventDefault();
    addNewTodo(title);
    setTitle('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form
        onSubmit={onSumbit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChange}
        />
      </form>
    </header>
  );
};
