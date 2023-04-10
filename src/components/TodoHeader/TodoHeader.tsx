import React, { SyntheticEvent, useState } from 'react';

type Props = {
  onTodoAdd: (todoTitle: string) => Promise<void>;
};

export const TodoHeader: React.FC<Props> = ({ onTodoAdd }) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const handleSumbit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setIsInputDisabled(true);

    await onTodoAdd(newTodoTitle);
    setIsInputDisabled(false);
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button type="button" className="todoapp__toggle-all active" />

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
    </header>
  );
};
