import {
  FC,
  memo,
  useCallback,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { TodoData } from '../../types/TodoData';
import { ErrorsType } from '../../types/ErrorsType';
import { addTodo } from '../../api/todos';

interface Props {
  onAdd: (newTodo: Todo) => void,
  onChange: (newTodo: Todo | null) => void,
  displayError: (error: ErrorsType) => void,
  hideError: () => void,
  userId: number,
}

export const TodoForm: FC<Props> = memo(({
  onAdd,
  onChange,
  displayError,
  userId,
}) => {
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const handleFormSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (title.trim().length === 0) {
        displayError(ErrorsType.EMPTY);

        return;
      }

      const addingTodo: TodoData = {
        title,
        userId,
        completed: false,
      };

      onChange({ ...addingTodo, id: 0 });

      try {
        setIsDisabled(true);
        const todoToAdd = await addTodo(addingTodo);

        onAdd(todoToAdd);
        setTitle('');
      } catch {
        displayError(ErrorsType.ADD);
      } finally {
        onChange(null);
        setIsDisabled(false);
      }
    }, [title],
  );

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={isDisabled}
      />
    </form>
  );
});
