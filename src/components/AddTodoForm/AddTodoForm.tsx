import React, { useState } from 'react';

type Props = {
  addNewTodo: (title: string) => void;
};

export const AddTodoForm:React.FC<Props> = ({
  addNewTodo,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [hasTitleError, setHasTitleError] = useState(false);

  const handleInput = (event:React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const resetForm = () => {
    setTodoTitle('');
  };

  const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setHasTitleError(!todoTitle);

    if (!hasTitleError) {
      addNewTodo(todoTitle);

      resetForm();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoTitle}
        onChange={handleInput}
      />
    </form>
  );
};
