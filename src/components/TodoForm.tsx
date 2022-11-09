import React, { useRef } from 'react';
import { ErrorType } from '../types/ErrorType';

type Props = {
  newTitile: string;
  setNewTitle: (value: string) => void;
  setErrors: (value: ErrorType) => void;
  addNewTodo: (value: string) => void;
};

export const TodoForm: React.FC<Props>
  = ({
    newTitile,
    setNewTitle,
    addNewTodo,
    setErrors,
  }) => {
    const newTodoField = useRef<HTMLInputElement>(null);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (newTitile.trim().length === 0) {
        setErrors(ErrorType.EMPTYTITLE);

        return;
      }

      addNewTodo(newTitile);
      setNewTitle('');
    };

    return (
      <header className="todoapp__header">
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
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
            value={newTitile}
            onChange={(event) => setNewTitle(event.target.value)}
          />
        </form>
      </header>
    );
  };
