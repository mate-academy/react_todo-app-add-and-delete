import React, {
  useEffect, useRef, useState,
} from 'react';
import { ErorTypes } from '../../types/ErrorTypes';

type Props = {
  addNewTodo: (title: string) => void,
  isAdding: boolean,
  setIsErrorMessage: (value: ErorTypes) => void,
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

    try {
      if (!newTodoTitle.trim()) {
        setIsErrorMessage(ErorTypes.title);
      } else {
        addNewTodo(newTodoTitle);
        setNewTodoTitle('');
      }
    } catch {
      setIsErrorMessage(ErorTypes.upload);
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
