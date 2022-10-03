import { useState } from 'react';
import { createTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';

type Props = {
  newTodoField: any;
  todos: Todo[];
  user: User | null
  setTodos: any;
  setHasLoadingError: (value: boolean) => void;
  setErrorNotification: (value: string) => void;
  setIsLoading: (value: boolean) => void;
};

export const NewTodo: React.FC<Props> = ({
  newTodoField,
  todos,
  user,
  setTodos,
  setHasLoadingError,
  setErrorNotification,
  setIsLoading,
}) => {
  const [title, setTitle] = useState('');

  const handledTitle = (event:React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value.replace(/^(\s)*/g, ''));
  };

  const createTodos = async () => {
    setIsLoading(false);
    try {
      if (user) {
        const newTodo = await createTodo(title, user?.id);

        setTodos([...todos, newTodo]);
        setIsLoading(true);
      }
    } catch (error) {
      setHasLoadingError(true);
      setErrorNotification('Unable to add a todo');
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!title) {
      setHasLoadingError(true);
      setErrorNotification('Title can\'t be empty');

      return;
    }

    event.preventDefault();
    createTodos();
    setTitle('');
  };

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
