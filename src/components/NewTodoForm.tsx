import { RefObject } from 'react';
import { post } from '../api/todos';
import { Todo } from '../types/Todo';
import { User } from '../types/User';

interface Props {
  newTodoField: RefObject<HTMLInputElement>;
  newTodoTitle: string;
  setNewTodoTitle: (value: string) => void;
  setError: (value: string) => void
  todos: Todo[],
  setTodos: (value: Todo[]) => void,
  setIsLoading: (value: boolean) => void,
  setTempTitle: (value: string) => void,
  user: User | null,
  isLoading: boolean,
}
export const NewTodoForm: React.FC<Props> = ({
  newTodoField,
  newTodoTitle,
  setNewTodoTitle,
  setError,
  setTodos,
  todos,
  setIsLoading,
  setTempTitle,
  user,
  isLoading,
}) => {
  const handlerInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
    setTempTitle(event.target.value);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTodoTitle.trim().length === 0) {
      setError('Title can\'t be empty');

      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (user) {
          const newTodosFromUser: Todo = await post(newTodoTitle, user?.id);

          setTodos([...todos, newTodosFromUser]);
        }
      } catch (errorFromServer) {
        setError('Unable to add a todo');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    setNewTodoTitle('');
  };

  return (
    <form
      onSubmit={onSubmit}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        value={newTodoTitle}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onChange={handlerInput}
        disabled={isLoading}
      />
    </form>
  );
};
