import React, { FC, useState } from 'react';

type Props = {
  todoField: any;
  setNewTodo: (title: string) => void;
  isAdding: boolean;
};

export const TodoForm: FC<Props> = ({
  todoField,
  setNewTodo,
  isAdding,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const changeNewTodoTitle = (title: string) => setNewTodoTitle(title);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setNewTodo(newTodoTitle);
    changeNewTodoTitle('');
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        disabled={isAdding}
        data-cy="NewTodoField"
        type="text"
        ref={todoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={(event) => changeNewTodoTitle(event.target.value)}
      />
    </form>
  );
};
