/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { ErrorValues } from '../../types/ErrorValues';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  query: string,
  isAdding: boolean,
  getErrorStatus: (errStatus: ErrorValues) => void,
  onSetterOfQuery: (settedQuery: string) => void,
  AddingTodos: () => void,
};

export const TodosHeader: React.FC<Props> = ({
  newTodoField,
  query,
  isAdding,
  getErrorStatus,
  onSetterOfQuery,
  AddingTodos,
}) => {
  useEffect(() => {
    if (newTodoField.current && !isAdding) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  const SubmitForm = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      getErrorStatus(ErrorValues.BLANKQUERY);
    } else {
      AddingTodos();
    }
  };

  return (
    <>
      <header className="todoapp__header">
        <button
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
        />

        <form
          onSubmit={SubmitForm}
        >
          <input
            data-cy="NewTodoField"
            type="text"
            ref={newTodoField}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={query}
            onChange={event => onSetterOfQuery(event.target.value)}
            disabled={isAdding}
          />
        </form>
      </header>
    </>
  );
};
