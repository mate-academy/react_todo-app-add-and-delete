import React, { memo } from 'react';
// import { createTodo } from '../../api/todos';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  setIsError: (error: boolean) => void;
  onErrorMessage: (error: string) => void;
  onAddTodo: (newTitle: string) => void;
};

export const Header: React.FC<Props> = memo(
  ({
    newTodoField, setIsError, onErrorMessage, onAddTodo,
  }) => {
    const handlerSubmitTodo = (event: React.FormEvent) => {
      event.preventDefault();

      if (newTodoField.current?.value === '') {
        setIsError(true);
        onErrorMessage('Title can\'t be empty');
      }

      onAddTodo(newTodoField.current?.value || '');
    };

    return (
      <header className="todoapp__header">
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
        />

        <form onSubmit={handlerSubmitTodo}>
          <input
            data-cy="NewTodoField"
            type="text"
            ref={newTodoField}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
          />
        </form>
      </header>
    );
  },
);
