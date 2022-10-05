import {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  FC,
} from 'react';
import { postTodos } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  onAdd: (todo: Todo) => void;
  setErrorMessage: (error: string) => void;
  setIsAdding: (loader: boolean) => void;
  isAdding: boolean;
};

export const NewTodoField: FC<Props> = ({
  onAdd,
  setErrorMessage,
  setIsAdding,
  isAdding,
}) => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const reset = () => {
    setTitle('');
    setIsAdding(false);
  };

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault();

    setIsAdding(true);

    if (!title.trim()) {
      setErrorMessage('Title can\'t be empty');
      setTitle('');

      return;
    }

    try {
      if (!user) {
        return;
      }

      const newTodo = await postTodos(user.id, title);

      onAdd(newTodo);
    } catch {
      setErrorMessage('Unable to add a todo');
    }

    reset();
  }, [title, user]);

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
