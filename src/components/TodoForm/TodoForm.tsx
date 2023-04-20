import React from 'react';

type Props = {
  setTodoTitle: (title: string) => void;
  todoTitle: string
  onAdd: (title: string) => void;
};

export const TodoForm: React.FC<Props> = ({
  setTodoTitle,
  todoTitle,
  onAdd,
}) => {
  const handleTodoTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onAdd(todoTitle);
    setTodoTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoTitle}
        required
        pattern="^(?!\s*$).+"
        onChange={handleTodoTitle}
        title="Field cannot be empty"
      />
    </form>
  );
};
