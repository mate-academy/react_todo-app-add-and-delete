import React, { useEffect, useState } from 'react';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>;
  addTodoToServer: (newTodoTitle: string) => void;
  isTodoBeingAdded: boolean;
  setIsSuccessful: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const Header: React.FC<Props> = React.memo(({
  newTodoField,
  addTodoToServer,
  isTodoBeingAdded,
  setIsSuccessful,
  setErrorMessage,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const handleTitleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todoTitle.trim() === '') {
      setIsSuccessful(false);
      setErrorMessage('Please enter what needs to be done');

      return;
    }

    addTodoToServer(todoTitle);
  };

  useEffect(() => {
    if (!isTodoBeingAdded) {
      setTodoTitle('');
    }
  }, [isTodoBeingAdded]);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        aria-label="Toggle all todos button"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleTitleInput}
          disabled={isTodoBeingAdded}
        />
      </form>
    </header>
  );
});
