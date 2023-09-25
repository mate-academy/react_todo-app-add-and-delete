/* eslint-disable no-console */
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type SingleTodoProps = {
  handleRemove: (todoId: number) => void
  tempTodo: Todo;
  deletedTodoId: number | null;
  isAddingTodo: boolean;
};

export const TempTodo
= ({
  handleRemove, tempTodo, deletedTodoId, isAddingTodo,
}: SingleTodoProps) => {
  console.log('Deleted Todo Id:', deletedTodoId);
  console.log('Temp Todo:', tempTodo);

  return (
    <div
      className={tempTodo.completed ? 'todo completed' : 'todo'}
      data-cy="Todo"
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={tempTodo.completed}
          data-cy="TodoStatus"
        />
      </label>
      <span className="todo__title" data-cy="TodoTitle">{tempTodo.title}</span>
      <button
        type="button"
        data-cy="TodoDelete"
        className="todo__remove"
        onClick={() => handleRemove(tempTodo.id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isAddingTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
