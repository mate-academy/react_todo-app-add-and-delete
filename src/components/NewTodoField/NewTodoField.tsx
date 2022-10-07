import {
  FormEvent, useContext, useEffect, useRef, useState,
} from 'react';
import { getTodos, postTodos } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  onAdd: (todo: Todo) => void;
  setErrorMessage: (error: string) => void;
  setVisibleLoader: (loader: boolean) => void;
  visibleLoader: boolean;
  setTodos: (todos: Todo[]) => void;
};

export const NewTodoField: React.FC<Props> = ({
  setErrorMessage,
  setVisibleLoader,
  visibleLoader,
  setTodos,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const user = useContext(AuthContext);

  const [title, setTitle] = useState<string>('');
  const [completed, setCompleted] = useState<boolean>(false);

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
        getTodos(user?.id || 0)
          .then(setTodos);

        setVisibleLoader(false);
      }).catch(() => setErrorMessage('Unable to add a todo'));

      // eslint-disable-next-line no-param-reassign
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
