/* eslint-disable no-console */
import { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => void;
  isDeleting: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo, deleteTodo, isDeleting,
}) => {
  const [selectedTodoid, setSelectedTodopid] = useState(0);

  const removeTodo = (id: number) => {
    setSelectedTodopid(id);
    deleteTodo(id);
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed && 'todo completed'}`}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => {
          removeTodo(todo.id);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${
          isDeleting
          && ((selectedTodoid === todo.id) || todo.completed)
          && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
