/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { memo, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todosList: Todo[],
  onSubmit: (todoData: Omit<Todo, 'id' | 'userId'>) => void,
  newTodoField: React.RefObject<HTMLInputElement>,
  setIsError: (value: boolean) => void,
  setErrorText: (value:string)=> void,
};

export const Header: React.FC<Props> = memo(({
  todosList,
  newTodoField,
  onSubmit,
  setIsError,
  setErrorText,
}) => {
  const [title, setTitle] = useState('');

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const IsValidTitle = title.trim().length > 0;

    if (!IsValidTitle) {
      setIsError(true);
      setErrorText('Title can`t be empty');
    }

    onSubmit({
      title,
      completed: false,
    });
  };

  return (
    <header className="todoapp__header">
      {todosList.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
        />
      )}

      <form
        onSubmit={handleFormSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => {
            setIsError(false); setTitle(event.target.value);
          }}
        />
      </form>
    </header>
  );
});
