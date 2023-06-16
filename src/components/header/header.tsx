import { useState } from 'react';

import { Todo } from '../enums/todo';
import { ErrorMessage } from '../enums/errormessage';

 type Props = {
   todos: Todo[];
   onAdd: (title: string) => void;
   onAddError: (error: ErrorMessage) => void;
   isDisabled: boolean;
 };

export const Header: React.FC<Props> = ({
  todos,
  onAdd,
  onAddError,
  isDisabled,
}) => {
  const [newTodo, setNewTodo] = useState('');

  const handleChange = (e: React.BaseSyntheticEvent) => {
    setNewTodo(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTodo.trim()) {
      onAddError(ErrorMessage.TITLE);
      setNewTodo('');

      return;
    }

    onAdd(newTodo);
    setNewTodo('');
  };

  const hasActive = todos.some(todo => !todo.completed);

  return (
    <header className="todoapp__header">
      {hasActive && (
        <button
          aria-label="none"
          type="button"
          className="todoapp__toggle-all active"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={handleChange}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
