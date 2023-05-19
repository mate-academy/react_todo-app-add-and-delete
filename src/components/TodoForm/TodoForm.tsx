import { memo, useCallback, useState } from 'react';
import { TodoData } from '../../types/TodoData';
import { USER_ID } from '../../App.constants';
import { addTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  onError: (message: string) => void;
  onChange: (newTodo: Todo | null) => void;
  onCreate: (newTodo: Todo) => void;
};

export const TodoForm: React.FC<Props> = memo(({
  onError,
  onChange,
  onCreate,
}) => {
  const [query, setQuery] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const handleFormSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!query.trim().length) {
        onError('Title can\'t be empty');

        return;
      }

      onError('');

      const todoToAdd: TodoData = {
        title: query,
        userId: USER_ID,
        completed: false,
      };

      onChange({ ...todoToAdd, id: 0 });

      try {
        setIsInputDisabled(true);
        const newTodo = await addTodo(todoToAdd);

        onCreate(newTodo);
        setQuery('');
      } catch {
        onError('Unable to add a todo');
      } finally {
        onChange(null);
        setIsInputDisabled(false);
      }
    }, [query],
  );

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        disabled={isInputDisabled}
      />
    </form>
  );
});
