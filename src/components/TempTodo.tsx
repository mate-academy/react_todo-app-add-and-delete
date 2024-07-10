import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
};

export const TempTodo: React.FC<Props> = ({ todo }) => (
  <div data-cy="Todo" className="todo">
    {/* eslint-disable jsx-a11y/label-has-associated-control */
    /*
        eslint-disable jsx-a11y/control-has-associated-label */}
    <label className="todo__status-label" htmlFor={`${todo.id}`}>
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        id={`${todo.id}`}
      />
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {todo.title}
    </span>

    <button type="button" className="todo__remove" data-cy="TodoDelete">
      ×
    </button>

    {/* 'is-active' class puts this modal on top of the todo */}
    <div data-cy="TodoLoader" className="modal overlay is-active">
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
