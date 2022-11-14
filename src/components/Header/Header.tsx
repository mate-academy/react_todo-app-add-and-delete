import React, { useState } from "react";
import { Error } from '../../types/Error';

/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  addTodoToServer: (arg0: string) => Promise<void>;
  isAdding: boolean;  
  setErrorMessage: (arg0: Error) => void;
};

export const Header: React.FC<Props> = ({
  newTodoField, 
  addTodoToServer, 
  isAdding,   
  setErrorMessage, 
}) => {
const [title, setTitle] = useState('');

const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { value } = event.target;

  setTitle(value);
};

const handleSubmit = (event: React.FormEvent) => {
  event.preventDefault();

  if (!title.trim()) {
    setErrorMessage({
      hasError: true,
      hasMessage: 'Title can\'t be empty',
    });

    return;
  }
  
  addTodoToServer(title);
  setTitle('');
}

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitle}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
