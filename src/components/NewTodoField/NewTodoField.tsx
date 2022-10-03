import {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
  FC,
} from 'react';
import { postTodos } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  onAdd: (todo: Todo) => void;
  setErrorMessage: (error: string) => void;
};

export const NewTodoField: FC<Props> = ({ onAdd, setErrorMessage }) => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState<string>('');
  const [completed, setCompleted] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const reset = () => {
    setTitle('');
    setCompleted(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (title) {
      await postTodos(
        user?.id || 0,
        title,
      ).catch(() => setErrorMessage('Unable to add a todo'));

      await onAdd({
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
