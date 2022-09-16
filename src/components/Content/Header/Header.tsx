import React, { FormEvent, useState } from 'react';
import { Todo } from '../../../types/Todo';

type Props = {
  todos: Todo[];
  newTodo: React.RefObject<HTMLInputElement>;
  isAdding: boolean;
  onAddTodo: (newTodoTitle: string) => void;
};

export const Header: React.FC<Props> = ({
  todos, newTodo, isAdding, onAddTodo,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    onAddTodo(newTodoTitle);
    setNewTodoTitle('');
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
          aria-label="ToggleAll"
        />
      )}

      <form
        onSubmit={(event) => handleSubmit(event)}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodo}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          disabled={isAdding}
          onChange={(event) => setNewTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
