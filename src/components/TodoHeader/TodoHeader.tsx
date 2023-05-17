import { useState } from 'react';
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
      onError('Title can\'t be empty');

      return;
    }

    const newTodo: TodoData = {
      title,
      completed: false,
      userId: 10333,
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
