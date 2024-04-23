/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useState } from 'react';

type Props = {
  todo: Todo;
  handleDeleteTodo: (todoId: Todo['id']) => void;
  isTemp?: boolean;
};

const getTodoClass = (todo: Todo) =>
  classNames({
    todo: true,
    completed: todo.completed,
  });

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  isTemp = false,
}) => {
  const [isBeingDeleted, setIsBeingDeleted] = useState<boolean>(false);

  return (
    <div data-cy="Todo" className={getTodoClass(todo)}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          setIsBeingDeleted(true);
          handleDeleteTodo(todo.id);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames({
          modal: true,
          overlay: true,
          'is-active': isTemp || isBeingDeleted,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
