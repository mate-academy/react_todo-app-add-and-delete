import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  onSubmit: (todo: Omit<Todo, 'id'>) => Promise<void>;
  userId: number;
  onError: (er: string) => void;
  onSubmitTempTodo: (el: null | Omit<Todo, 'completed' | 'userId'>) => void;
  isLoading: boolean;
};

export const NewTodoForm: React.FC<Props> = ({
  onSubmit,
  userId,
  onError = () => {},
  onSubmitTempTodo = () => {},
  isLoading,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleField.current?.focus();
  }, [isLoading]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      onError('Title should not be empty');

      return;
    }

    const normalisedTitle = title.trim();
    const prevTitle = title;

    setIsSubmiting(true);

    onSubmitTempTodo({ id: 0, title: normalisedTitle });

    onSubmit({ userId, completed: false, title: normalisedTitle })
      .then(() => setTitle(''))
      .catch(() => {
        setTitle(prevTitle);
        onError('Unable to add a todo');
      })
      .finally(() => {
        setIsSubmiting(false);
        onSubmitTempTodo(null);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleTitleChange}
        ref={titleField}
        disabled={isSubmiting}
      />
    </form>
  );
};
