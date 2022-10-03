import { post } from '../api/todos';
import { Todo } from '../types/Todo';
import { User } from '../types/User';
/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  newTodoField: any;
  newTodoTitle: string;
  setNewTodoTitle: (value: string) => void;
  setError: (value: string) => void
  todos: Todo[],
  setTodos: any,
  setIsLoading: (value: boolean) => void,
  setTempTitle: (value: string) => void,
  user: User | null,
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
      />
    </form>
  );
};
