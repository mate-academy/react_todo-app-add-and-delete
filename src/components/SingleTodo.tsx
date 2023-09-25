/* eslint-disable no-console */
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type SingleTodoProps = {
  todo: Todo;
  handleRemove: (todoId: number) => void
  tempTodo: Todo | null;
  deletedTodoId: number | null;
};

export const SingleTodo
= ({
  todo, handleRemove, tempTodo, deletedTodoId,
}: SingleTodoProps) => {
  console.log('Todo:', todo);
  console.log('Deleted Todo Id:', deletedTodoId);
  console.log('Temp Todo:', tempTodo);

  return (
    <div
      className={todo.completed ? 'todo completed' : 'todo'}
      data-cy="Todo"
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          data-cy="TodoStatus"
        />
      </label>
      <span className="todo__title" data-cy="TodoTitle">{todo.title}</span>
      <button
        type="button"
        data-cy="TodoDelete"
        className="todo__remove"
        onClick={() => handleRemove(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': deletedTodoId === todo.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
