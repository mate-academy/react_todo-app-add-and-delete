import { useState } from 'react';

type TodoFormProps = {
  onSubmit: (title: string) => void;
  disabled: boolean;
};

export const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, disabled }) => {
  const [title, setTitle] = useState('');

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(title.trim());
    setTitle('');
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={disabled}
      />
    </form>
  );
};
