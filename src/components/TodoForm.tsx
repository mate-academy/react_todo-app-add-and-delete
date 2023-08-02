import { useState } from 'react';
import { Error } from '../types/Error';
import { Todo } from '../types/Todo';
import { USER_ID } from '../utils/constant';

type Props = {
  addTodo: (todo: Todo) => Promise<void>,
  setErrorMessage: (error: Error) => void,
  setTempTodo: (todo: Todo | null) => void,
};

export const TodoForm: React.FC<Props> = ({
  addTodo,
  setErrorMessage,
  setTempTodo,
}) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(Error.title);

      return;
    }

    const tempTodo: Todo = {
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    };

    setIsLoading(true);
    setTempTodo(tempTodo);

    addTodo(tempTodo)
      .then(() => setTitle(''))
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => setTitle(event.target.value)}
        disabled={isLoading}
      />
    </form>
  );
};
