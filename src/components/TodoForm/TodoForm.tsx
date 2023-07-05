import React, { useState } from 'react';

interface Props {
  addTodo: (todoTitle: string) => Promise<void>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const TodoForm: React.FC<Props> = ({ addTodo, setError }) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const handleFormSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!todoTitle) {
      setError('Please enter a title');
    }

    try {
      setIsInputDisabled(true);
      await addTodo(todoTitle);
    } catch {
      setError('Unable to add a todo');
    } finally {
      setIsInputDisabled(false);
      setTodoTitle('');
    }
  };

  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(e.target.value);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoTitle}
        onChange={handleInputChange}
        disabled={isInputDisabled}
      />
    </form>
  );
};
