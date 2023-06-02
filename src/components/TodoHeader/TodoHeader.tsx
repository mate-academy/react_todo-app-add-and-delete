/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useState } from 'react';

interface TodoFHeaderProps {
  onToggleAll: () => void;
  active: boolean;
  onAddTodo: (title: string) => void;
  isCreatingTodo: boolean;
}

export const TodoHeader: React.FC<TodoFHeaderProps> = (
  {
    onToggleAll,
    active,
    onAddTodo,
    isCreatingTodo,
  },
) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    onAddTodo(newTodoTitle.trim());
    setNewTodoTitle('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={
          classNames(
            'todoapp__toggle-all',
            { active },
          )
        }
        onClick={onToggleAll}
      />

      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value)}
          disabled={isCreatingTodo}
        />
      </form>
    </header>
  );
};
