import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';

interface Props {
  user: User | null;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setCurrentError: (value: React.SetStateAction<string>) => void;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (todoData: Omit<Todo, 'id'>) => Promise<void>;
  isAdding: boolean;
}

export const NewTodo: React.FC<Props> = (props) => {
  const {
    user,
    title,
    setTitle,
    setCurrentError,
    setHasError,
    onSubmit,
    isAdding,
  } = props;

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setCurrentError('Title cannot be empty');
      setHasError(true);
    }

    const userId = user?.id;

    if (!title || !userId) {
      return;
    }

    onSubmit({
      title,
      userId,
      completed: false,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={isAdding}
      />
    </form>
  );
};
