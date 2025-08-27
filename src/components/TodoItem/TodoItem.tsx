/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import cls from 'classnames';
import { Todo } from '../../types/Todo';

type TodoItemProps = {
  todo: Todo;
  onDeleteItem: (todoId: number) => void;
  loader?: boolean; // Optional prop to indicate loading state
  onToggleCompleted: (todoId: number, completed: boolean) => Promise<void>; // Function to toggle completed status
};
export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onDeleteItem,
  loader,
  onToggleCompleted,
}) => {
  return (
    // {/* This todo is an active todo */}
    <div data-cy="Todo" className={cls('todo', { completed: todo.completed })}>
      <label className="todo__status-label" htmlFor={`${todo.id}`}>
        <input
          autoFocus
          id={`${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={event => {
            onToggleCompleted(todo.id, event.target.checked);
          }}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className={cls('todo__remove')}
        data-cy="TodoDelete"
        onClick={() => onDeleteItem(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cls('modal overlay', { 'is-active': loader })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
