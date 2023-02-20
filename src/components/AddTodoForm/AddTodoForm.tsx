import { FormEvent, useState } from 'react';

type Props = {
  handleAddTodo: (todoTitle: string) => void,
  inputDisabled: boolean,
};

export const AddTodoForm: React.FC<Props> = ({
  handleAddTodo, inputDisabled,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setTodoTitle(value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    handleAddTodo(todoTitle);
    setTodoTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoTitle}
        onChange={handleInput}
        disabled={inputDisabled}
      />
    </form>
  );
};
