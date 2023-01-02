import React, {
  useEffect, useRef, useState,
} from 'react';
import { Errors } from '../../types/Errors';

type Props = {
  addNewTodo: (title: string) => void,
  isAdding: boolean,
  setIsErrorMessage: (value: Errors) => void,
};

export const NewTodo: React.FC<Props> = ({
  addNewTodo,
  isAdding,
  setIsErrorMessage,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setIsErrorMessage(Errors.title);
    } else {
      addNewTodo(newTodoTitle);
      setNewTodoTitle('');
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        value={newTodoTitle}
        onChange={(event) => setNewTodoTitle(event.target.value)}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isAdding}
      />
    </form>
  );
};
