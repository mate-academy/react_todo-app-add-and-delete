import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (todo: Todo, todoIndex: number) => void;
  indexOfTodo: number,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  indexOfTodo,
}) => {
  const onRemove = (event: React.MouseEvent) => {
    event.preventDefault();

    deleteTodo(todo, indexOfTodo);
  };

  return (
    <div className={classNames(
      'todo',
      { completed: todo.completed },
    )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        onClick={onRemove}
      >
        ×
      </button>
    </div>
  );
};
