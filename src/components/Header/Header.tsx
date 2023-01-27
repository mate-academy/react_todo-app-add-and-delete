/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
} from 'react';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  isLoading: boolean;
  setError: Dispatch<SetStateAction<ErrorType>>;
  newTitle: string;
  setNewTitle: Dispatch<SetStateAction<string>>
  addTodo: (title: string) => void;
};

export const Header:React.FC<Props> = ({
  isLoading,
  setError,
  newTitle,
  setNewTitle,
  addTodo,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTitle === '') {
      setError(ErrorType.TitleError);

      return;
    }

    if (newTodoField.current) {
      addTodo(newTitle);
      setNewTitle('');
    }
  };

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
          disabled={isLoading}
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
