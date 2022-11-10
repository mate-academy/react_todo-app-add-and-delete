/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { ErrorNoticeType } from '../../types/ErrorNoticeType';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>,
  isAdding: boolean,
  setHasError: (status: boolean) => void,
  setErrorNotice: (notice: ErrorNoticeType) => void,
  postTodoToServer: (title: string) => void,
}

export const NewTodo: React.FC<Props> = ({
  newTodoField,
  isAdding,
  setHasError,
  setErrorNotice,
  postTodoToServer,
}) => {
  const [newTitle, setNewTitle] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTitle.trim()) {
      setHasError(true);
      setErrorNotice(ErrorNoticeType.TitleError);

      return;
    }

    postTodoToServer(newTitle);
  };

  useEffect(() => {
    if (!isAdding) {
      setNewTitle('');
    }
  }, [isAdding]);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={event => {
            setNewTitle(event.target.value);
          }}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
