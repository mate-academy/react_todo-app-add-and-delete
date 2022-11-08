/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC, RefObject, useState, ChangeEvent, FormEvent, Dispatch,
} from 'react';

type Props = {
  newTodoField: RefObject<HTMLInputElement>;
  isAdding: boolean;
  addTodoToServer: (todoTitle: string) => Promise<void>;
  setIsError: Dispatch<React.SetStateAction<boolean>>;
  setError: Dispatch<React.SetStateAction<string>>;
};

export const Header: FC<Props> = ({
  newTodoField,
  isAdding,
  addTodoToServer,
  setIsError,
  setError,
}) => {
  const [title, setTitle] = useState('');

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value.trim());
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      setIsError(true);
      setError('Title can\'t be empty');

      return;
    }

    addTodoToServer(title);
    setTitle('');
  };

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
          onChange={handleInput}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
