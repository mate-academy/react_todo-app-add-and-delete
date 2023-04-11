import React from 'react';

type Props = {
  setTodoTitle: (title: string) => void;
  todoTitle: string
  onAdd: (title: string) => void;
};

export const FormTodo: React.FC<Props> = ({
  setTodoTitle,
  todoTitle,
  onAdd,
}) => {
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
        onChange={(event) => setTodoTitle(event.target.value)}
      />
    </form>
  );
};
