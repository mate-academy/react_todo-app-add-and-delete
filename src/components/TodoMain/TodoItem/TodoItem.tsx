/* eslint-disable no-console */
import classNames from 'classnames';
import { Todo } from '../../../types/Todo';
import { useEffect } from 'react';

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
  useEffect(() => {
    console.log('selectedTodoId before deletion:', selectedTodoId); // for testing
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
            todoIsDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
