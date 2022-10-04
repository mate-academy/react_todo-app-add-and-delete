import {
  FormEvent, useContext, useEffect, useRef, useState,
} from 'react';
import { postTodos } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  onAdd: (todo: Todo) => void;
  setErrorMessage: (error: string) => void;
  setVisibleLoader: (loader: boolean) => void;
  visibleLoader: boolean;
};

export const NewTodoField: React.FC<Props> = ({
  onAdd,
  setErrorMessage,
  setVisibleLoader,
  visibleLoader,
}) => {
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
      setVisibleLoader(true);

      postTodos({
        userId: user?.id || 0,
        title,
        completed,
      }).then(() => {
        setVisibleLoader(false);
      }).catch(() => setErrorMessage('Unable to add a todo'));

      onAdd({
        id,
        userId: user?.id || 0,
        title,
        completed,
      });

      // eslint-disable-next-line no-param-reassign
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
        disabled={visibleLoader}
      />
    </form>
  );
};
