import React, { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  placeholder: string;
  className: string;
  onSubmit: (todo: Omit<Todo, 'id'>) => void,
  todo?: Todo,
  userId: number
};

export const Form: React.FC<Props> = ({
  placeholder,
  className,
  onSubmit,
  todo,
  userId,
}) => {
  const [title, setTitle] = useState<string>(todo?.title || '');
  const [completed] = useState(todo?.completed || false);
  const [tempDisable, setTempDisable] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const todoData = {
      title,
      completed,
      userId,
    };

    onSubmit(todoData);
    setTempDisable(true);
    setTitle('');

    setTimeout(() => {
      setTempDisable(false);
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className={className}
        placeholder={placeholder}
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
        }}
        disabled={tempDisable}
      />
    </form>
  );
};
