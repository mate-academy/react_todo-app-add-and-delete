import React, { SyntheticEvent, useState } from 'react';

type Props = {
  onTodoAdd: (todoTitle: string) => Promise<void>;
};

export const NewTodo: React.FC<Props> = ({ onTodoAdd }) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const handleSumbit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setIsInputDisabled(true);

    await onTodoAdd(newTodoTitle.trim());
    setIsInputDisabled(false);
    setNewTodoTitle('');
  };

  return (
    <form onSubmit={handleSumbit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={(changeEvent) => setNewTodoTitle(changeEvent.target.value)}
        disabled={isInputDisabled}
      />
    </form>
  );
};
