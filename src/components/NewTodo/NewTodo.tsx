import React, {
  RefObject,
  useState,
  Dispatch,
  SetStateAction,
  useCallback
} from 'react';
import { createTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';

type Props = {
  newTodoField: RefObject<HTMLInputElement>;
  user: User | null
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setErrorNotification: (value: string) => void;
  setIsShownTempTodo: (value: boolean) => void;
  setPreviewTitle: (value: string) => void;
};

export const NewTodo: React.FC<Props> = ({
  newTodoField,
  user,
  setTodos,
  setErrorNotification,
  setIsShownTempTodo,
  setPreviewTitle,
}) => {
  const [title, setTitle] = useState('');

  const handledTitle = useCallback(
    (event:React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = event.target.value.replace(/^(\s)*/g, '');

      setTitle(newTitle);
      setPreviewTitle(newTitle);
    }, [],
  );

  const createTodos = async () => {
    setIsShownTempTodo(true);
    try {
      if (user) {
        const newTodo = await createTodo(title, user?.id);

        setTodos(prevTodos => [...prevTodos, newTodo]);
      }
    } catch (error) {
      setErrorNotification('Unable to add a todo');
    } finally {
      setIsShownTempTodo(false);
    }
  };

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!title) {
        setErrorNotification('Title can\'t be empty');

        return;
      }

      createTodos();
      setTitle('');
    }, [createTodos],
  );

  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handledTitle}
      />
    </form>
  );
};
