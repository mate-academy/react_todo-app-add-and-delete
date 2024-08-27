/* eslint-disable no-console */
import classNames from 'classnames';
import { Todo } from '../../../types/Todo';
import { useEffect, useState } from 'react';

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  todo: Todo;
  isDataInProceeding: boolean;
  selectedTodoId: number | null;
  todoIsDeleting?: number | null;
  onDelete: (todoId: number) => void;
  toggleStatus: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isDataInProceeding,
  selectedTodoId,
  todoIsDeleting,
  onDelete,
  toggleStatus,
}) => {
  const [isTempTodoCreating, setIsTempTodoCreating] = useState(false);

  useEffect(() => {
    if (todo.id === 0) {
      setIsTempTodoCreating(true);
      setInterval(() => {
        setIsTempTodoCreating(false);
      }, 100);
    }
  }, [todo.id]);

  useEffect(() => {
    console.log('selectedTodoId before deletion:', selectedTodoId);
  }, [selectedTodoId]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', todo.completed ? 'completed' : 'active')}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            toggleStatus(todo.id);
          }}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={async () => {
          await onDelete(todo.id);
          console.log('after deletion', isDataInProceeding); // for testing
          console.log('selectedTodoId after deletion', selectedTodoId); // for testing
        }}
      >
        x
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            (isDataInProceeding && selectedTodoId === todo.id) ||
            isTempTodoCreating ||
            todoIsDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
