import React, { SetStateAction, useState } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  setErrorMessage: React.Dispatch<SetStateAction<string>>;
  setErrorStatus: React.Dispatch<SetStateAction<boolean>>;
  addTodoOnServer: (todoTitle: string) => void;
  isAdding: boolean;
};

export const NewTodo: React.FC<Props> = ({
  newTodoField,
  setErrorMessage,
  setErrorStatus,
  addTodoOnServer,
  isAdding,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (query.trim() === '') {
      setErrorMessage('Title can\'t be empty');
      setErrorStatus(true);
    } else {
      addTodoOnServer(query);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isAdding}
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
    </form>
  );
};
