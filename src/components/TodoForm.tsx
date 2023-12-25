import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { Error } from '../types/Error';
import { USER_ID } from '../utils/variables';

type Props = {
  addTodo: ({ title, completed, userId }: Omit<Todo, 'id'>) => Promise<void>;
  pending: boolean;
  setErrorType: (errorType: Error | null) => void;
};

export const TodoForm: React.FC<Props> = ({
  addTodo,
  pending,
  setErrorType,
}) => {
  const [newTitle, setNewTitle] = useState('');

  const textField = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      setErrorType(Error.EmptyTitle);

      return;
    }

    addTodo({
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    })
      .then(() => setNewTitle(''));
  };

  useEffect(() => {
    if (textField) {
      textField.current?.focus();
    }
  }, [addTodo]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={textField}
        value={newTitle}
        onChange={(event) => setNewTitle(event.target.value)}
        disabled={pending}
      />
    </form>
  );
};
