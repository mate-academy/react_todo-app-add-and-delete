import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

const USER_ID = 11712;

interface TodoProps {
  todos: Todo[];
  setTodos: (todo: Todo) => void;
}

export const Header: React.FC<TodoProps> = ({ todos, setTodos }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTodo = {
      id: +new Date(),
      title,
      userId: USER_ID,
      completed: false,
    };

    if (title.trim()) {
      setTodos(newTodo);

      setTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every((todo) => todo.completed),
          })}
          data-cy="ToggleAllButton"
          aria-label="Toggle All"
        />
      )}
      <form action="/" method="POST" onSubmit={handleSubmit}>
        <input
          value={title}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={(e) => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
