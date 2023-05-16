import { useState } from 'react';
import { ErrorType } from '../../utils/ErrorType';
import { USER_ID } from '../../utils/constants';
import { TodoData } from '../../types/TodoData';

interface Props {
  onError: (error: string) => void;
  onAddTodo: (newTodo: TodoData) => Promise<void>;
  isLoadingForm: boolean;
}

export const AddTodoForm: React.FC<Props> = ({
  onError,
  onAddTodo,
  isLoadingForm,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      onError(ErrorType.EMPTY_TITLE);

      return;
    }

    const newTodo: TodoData = {
      title,
      completed: false,
      userId: USER_ID,
    };

    onAddTodo(newTodo);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={isLoadingForm}
      />
    </form>
  );
};
