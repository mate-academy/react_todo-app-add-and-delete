import {
  FormEvent, useContext, useEffect, useRef, useState,
} from 'react';
import { postTodos } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  onAdd: (todo: Todo) => void;
  setErrorMessage: (error: string) => void;
};

export const NewTodoField: React.FC<Props> = ({ onAdd, setErrorMessage }) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const user = useContext(AuthContext);

  const [title, setTitle] = useState<string>('');
  const [completed, setCompleted] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);

  const reset = () => {
    setTitle('');
    setCompleted(false);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (title) {
      postTodos({
        userId: user?.id || 0,
        title,
        completed,
      }).catch(() => setErrorMessage('Unable to add a todo'));

      onAdd({
        id,
        userId: user?.id || 0,
        title,
        completed,
      });

      setId(prevId => prevId + 1);
    } else {
      setErrorMessage('Title can\'t be empty');
    }

    reset();
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

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
      />
    </form>
  );
};
