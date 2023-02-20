/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';

type Props = {
  addNewTodo: (newtodo: string) => void,
  addErrorMessage: (newMessage: string) => void,
  isSubmitButtonDisabled: boolean,
};

export const Header: React.FC<Props> = ({
  addNewTodo,
  addErrorMessage,
  isSubmitButtonDisabled,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle) {
      addErrorMessage('Unable to update a todo');
    }

    addNewTodo(todoTitle);
    setTodoTitle('');
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
          disabled={isSubmitButtonDisabled}
        />
      </form>
    </header>
  );
};
