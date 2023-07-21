import React, { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  addTodo: (todo: string) => void,
};

export const Header: React.FC<Props> = ({ todos, addTodo }) => {
  const isActiveTodos = todos.filter(todo => !todo.completed);
  const [value, setValue] = useState('');

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(value);
    setValue('');
  };

  return (
    <header className="todoapp__header">
      {isActiveTodos && (
        <button
          type="button"
          aria-label="button"
          className="todoapp__toggle-all active"
        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </form>
    </header>
  );
};
