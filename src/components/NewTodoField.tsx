import { createTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { User } from '../types/User';

type Props = {
  user: User | null,
  onSetTodo: (newTodo: Todo) => void,
  newTodoField: React.RefObject<HTMLInputElement>,
  title: string,
  changeTitle: (value: string) => void,
  onSetTitleError: (isError: boolean) => void,
  onSetIsAdding: (isLoading: boolean) => void,
  isAdding: boolean,
};

export const NewTodoField: React.FC<Props> = (
  {
    user,
    onSetTodo,
    newTodoField,
    title,
    changeTitle,
    onSetTitleError,
    onSetIsAdding,
    isAdding,
  },
) => {
  const addNewTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    if (title.trim().length === 0) {
      onSetTitleError(true);
      setTimeout(() => onSetTitleError(false), 3000);

      return;
    }

    onSetTitleError(false);
    onSetIsAdding(true);

    const newTodo = await createTodo(title, user.id, false);

    onSetTodo(newTodo);

    onSetIsAdding(false);
    changeTitle('');
  };

  return (
    <form
      onSubmit={addNewTodo}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => {
          onSetTitleError(false);
          changeTitle(event.target.value);
        }}
        disabled={isAdding}
      />
    </form>
  );
};
