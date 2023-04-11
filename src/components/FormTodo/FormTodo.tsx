import React from 'react';

type Props = {
  setTodoTitle: (title: string) => void;
  todoTitle: string
};

export const FormTodo: React.FC<Props> = ({ setTodoTitle, todoTitle }) => {
  return (
    <form>
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
