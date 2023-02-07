import { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  onSubmit: (todo:Todo) => void
  placeholder: string
  className: string,
  todo?: Todo,
  userId: number
  todos: Todo[]
};

export const Form: React.FC<Props> = ({
  onSubmit,
  placeholder,
  className,
  todo,
  userId,
  todos,
}) => {
  const [title, setTitle] = useState<string>(todo?.title || '');
  const [completed] = useState(todo?.completed || false);
  const [tempDisable, setTempDisable] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newTodo = {
      title,
      id: Math.max(...todos.map(element => element.id)) + 1,
      completed,
      userId,
    };

    onSubmit(newTodo);
    setTempDisable(true);
    setTitle('');

    setTimeout(() => {
      setTempDisable(false);
    }, 3000);
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
        disabled={tempDisable}

      />
    </form>
  );
};
