import React, { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todos: Todo[];
};

export const Task: React.FC<Props> = ({ todo, setTodos, todos }) => {
  const [isChecked, setIsChecked] = useState<boolean>(todo.completed);

  const handleCheck = () => {
    const updatedTodo = { ...todo, completed: !isChecked };

    setIsChecked(!isChecked);
    // eslint-disable-next-line max-len
    setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
  };

  const handleRemove = () => {
    const updatedTodo = { ...todo, removed: true };

    // eslint-disable-next-line max-len
    setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
  };

  return (
    <div className={todo.completed ? 'todo completed' : 'todo'}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={isChecked}
          onChange={handleCheck}
        />
      </label>
      <span className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={handleRemove}
      >
        ×
      </button>
    </div>
  );
};
