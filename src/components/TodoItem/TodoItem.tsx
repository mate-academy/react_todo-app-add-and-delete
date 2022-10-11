import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  removeTodo: (value: number) => void,
  setSelectedTodos: (value: number[]) => void,
  onUpdate: (todoId: number, data: Partial<Todo>) => void,
  selectedTodos: number[],
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  setSelectedTodos,
  onUpdate,
  selectedTodos,
}) => {
  const handleRemove = () => {
    removeTodo(todo.id);
    setSelectedTodos([todo.id]);
  };

  const handleUpdate = () => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  const isSelectedTodos = selectedTodos?.includes(todo.id);

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={handleUpdate}
          defaultChecked
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={handleRemove}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': isSelectedTodos,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
