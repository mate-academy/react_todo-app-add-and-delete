import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  setErrorMessage: (err: string) => void;
  userId: number;
  addTodo: (todo: Todo) => Promise<void>;
  loading: boolean;
};

export const AddTodoForm: React.FC<Props> = ({
  setErrorMessage,
  userId,
  addTodo,
  loading,
}) => {
  const [title, setTitle] = useState<string>('');

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const reset = () => setTitle('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      completed: false,
      title,
      userId,
    };

    addTodo(newTodo);
    reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={onChangeInput}
        disabled={loading}
      />
    </form>
  );
};
