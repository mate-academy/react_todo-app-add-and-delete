import React, { memo, useState } from 'react';
// import { createTodo } from '../../api/todos';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  setIsError: (error: boolean) => void;
  onErrorMessage: (error: string) => void;
  onAddTodo: (newTitle: string) => void;
  isNewTodoLoading: boolean;
};

export const Header: React.FC<Props> = memo(
  ({
    newTodoField, setIsError, onErrorMessage, onAddTodo, isNewTodoLoading,
  }) => {
    const [title, setTitle] = useState('');

    const handlerSubmitTodo = (event: React.FormEvent) => {
      event.preventDefault();

      if (title === '') {
        setIsError(true);
        onErrorMessage('Title can\'t be empty');
      }

      setTitle('');
      onAddTodo(title);
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
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            disabled={isNewTodoLoading}
          />
        </form>
      </header>
    );
  },
);
