/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useState } from 'react';

interface Props {
  onAddTodo: (value: string) => void;
  showInputError: (value: string) => void;
}

export const TodoForm: FC<Props> = ({
  onAddTodo,
  showInputError,
}) => {
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      showInputError('Title cant be empty');

      return;
    }

    try {
      setIsLoading(true);
      onAddTodo(todoTitle);
      setTodoTitle('');
    } catch {
      showInputError('Unable to add todo title');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmitForm}>
      <input
        value={todoTitle}
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onChange={handleTitleChange}
        disabled={isLoading}
      />
    </form>
  );
};
