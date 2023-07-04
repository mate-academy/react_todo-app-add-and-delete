import React from 'react';

interface Props {
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  setErrorMessage: (message: string) => void;
  onAddTodo: () => void;
  isLoading: boolean;
}

export const NewTodo: React.FC<Props> = ({
  newTodoTitle,
  setNewTodoTitle,
  setErrorMessage,
  onAddTodo,
  isLoading,
}) => {
  const handleChangeTodoTitle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewTodoTitle(event.target.value);
    setErrorMessage('');
  };

  const handleOnSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    onAddTodo();
  };

  return (
    <form
      onSubmit={handleOnSubmit}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={handleChangeTodoTitle}
        disabled={isLoading}
      />
    </form>
  );
};
