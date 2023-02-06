import { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  onSubmit: (todo:Todo) => void
  placeholder: string
  className: string
  isLoading: boolean
  todo?: Todo,
  userId: number
  todos: Todo[]
};

export const Form: React.FC<Props> = ({
  onSubmit,
  placeholder,
  className,
  isLoading,
  todo,
  userId,
  todos,
}) => {
  const [title, setTitle] = useState<string>(todo?.title || '');
  const [completed] = useState(todo?.completed || false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newTodo = {
      title,
      id: Math.max(...todos.map(element => element.id)) + 1,
      completed,
      userId,
    };

    onSubmit(newTodo);
    setTitle('');
  };

  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className={className}
        placeholder={placeholder}
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
        }}
        disabled={isLoading}

      />
    </form>
  );
};
