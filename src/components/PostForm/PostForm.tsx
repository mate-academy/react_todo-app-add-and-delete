import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';

type Props = {
  onSubmit: ({ title, completed, userId }: Omit<Todo, 'id'>) => Promise<void>;
  setErrorMessage: (errorMessage: string) => void;
  loading: boolean;
};

export const PostForm: React.FC<Props> = ({
  onSubmit,
  setErrorMessage,
  loading,
}) => {
  const todoInput = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (todoInput.current) {
      todoInput.current.focus();
    }
  }, [loading]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    onSubmit({ title: trimmedTitle, completed: false, userId: USER_ID }).then(
      () => setTitle(''),
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={todoInput}
        disabled={loading}
        value={title}
        onChange={event => setTitle(event.target.value)}
      />
    </form>
  );
};
