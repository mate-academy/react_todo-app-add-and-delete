import React from 'react';
import { ErrorTypes } from '../types/ErrorTypes';

type Props = {
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorTypes | null>>;
  addTodo: boolean;
  handleAddTodo: (title: string) => Promise<void>;
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const NewTodoInput: React.FC<Props> = ({
  setErrorMessage,
  addTodo,
  handleAddTodo,
  newTodoTitle,
  setNewTodoTitle,
  inputRef,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedValue = newTodoTitle.trim();

    if (!trimmedValue) {
      setErrorMessage(ErrorTypes.EMPTY_TITLE);
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      inputRef.current?.focus();
    } else {
      setErrorMessage(null);

      try {
        await handleAddTodo(trimmedValue);
      } catch (error) {
        setErrorMessage(ErrorTypes.ADD_TODO_FAILED);
        setTimeout(() => setErrorMessage(null), 3000);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={handleInputChange}
        ref={inputRef}
        disabled={addTodo}
      />
    </form>
  );
};
