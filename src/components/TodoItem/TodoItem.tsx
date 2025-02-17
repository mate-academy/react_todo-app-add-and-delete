import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  handleDeleteTodo: (todoId: number) => void;
  loadingTodos: number[];
};

export const TodoItem = ({ todo, handleDeleteTodo, loadingTodos }: Props) => {
  const isCompleted = todo.completed;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: isCompleted })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label" htmlFor={String(todo.id)}>
        <input
          id={String(todo.id)}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={isCompleted}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodos.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
