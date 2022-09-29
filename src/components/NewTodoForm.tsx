import { post } from '../api/todos';
import { Todo } from '../types/Todo';
/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  newTodoField: any;
  newTodoTitle: string;
  setTodoTitle: (value: string) => void;
  setError: (value: string) => void
  error: string,
  todos: Todo[],
  setTodos: any,
  setLoading: (value: boolean) => void,
}
export const NewTodoForm: React.FC<Props> = ({
  newTodoField,
  newTodoTitle,
  setTodoTitle,
  setError,
  error,
  setTodos,
  todos,
  setLoading,
}) => {
  const handlerInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTodoTitle.trim().length === 0) {
      setError('Title can\'t be empty');

      return;
    }

    if (!error) {
      const fetchData = async () => {
        try {
          const newTodosFromUser = await post(newTodoTitle, 4446);

          setLoading(true);

          setTodos([...todos, newTodosFromUser]);
          setLoading(false);
        } catch (errorFromServer) {
          setError('Unable to add a todo');
        }
      };

      fetchData();
    }

    setTodoTitle('');
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
