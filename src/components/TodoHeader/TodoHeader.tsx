/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onTodoAdd: (todoTitle: string) => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  todos, onTodoAdd, inputRef, isLoading,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle) {
      return;
    }

    onTodoAdd(todoTitle)
      .then(() => {
        setTodoTitle('');
      });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={onFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={onTitleChange}
          ref={inputRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
