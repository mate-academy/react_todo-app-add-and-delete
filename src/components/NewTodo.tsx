import { useState } from 'react';

interface NewTodoProps {
  onTodoAdd: (newTodoTitle: string) => void;
}

export const NewTodo = ({ onTodoAdd }: NewTodoProps) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  return (
    <form onSubmit={(event) => {
      if (newTodoTitle) {
        event.preventDefault();
        onTodoAdd(newTodoTitle);
      }
    }}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={(event) => setNewTodoTitle(event.target.value)}
      />
    </form>
  );
};
