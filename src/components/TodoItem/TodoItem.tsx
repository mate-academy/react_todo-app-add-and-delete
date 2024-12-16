import classNames from 'classnames';

import { Todo } from '../../types/Todo';

type TodoItemProps = {
  onDeleteTodo: (id: number) => void;
  todo: Todo;
  isLoadingChange: boolean;
  deleteTodoId: number | null;
  cleanCompleted: boolean;
  isAdding?: boolean;
};

export function TodoItem({
  todo,
  onDeleteTodo,
  isLoadingChange,
  deleteTodoId,
  cleanCompleted,
  isAdding,
}: TodoItemProps) {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label htmlFor={`${todo.id}`} className="todo__status-label">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <input
          id={`${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
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
        onClick={() => onDeleteTodo(todo.id)}
      >
        ×
      </button>

      {/* Overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active':
            (isLoadingChange && deleteTodoId === todo.id) ||
            (cleanCompleted && todo.completed) ||
            isAdding,
        })}
        key={todo.id}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
}
