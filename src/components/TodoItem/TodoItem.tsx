/* eslint-disable quote-props */
/* eslint-disable no-console */
import classNames from 'classnames';
import { useContext } from 'react';
import { Todo } from '../../types/Todo';
// eslint-disable-next-line import/no-cycle
import {
  LoadingContext,
  TodoUpdateContext,
} from '../../TodosContext/TodosContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { removeTodo, changeTodo } = useContext(TodoUpdateContext);
  const { loading, startLoading } = useContext(LoadingContext);

  function handleRemove(event: React.FormEvent<HTMLButtonElement>) {
    event.preventDefault();
    startLoading(todo.id);
    const deleteId: number = todo.id;

    removeTodo(deleteId);
  }

  function handleChangeTodo() {
    startLoading(todo.id);
    changeTodo(todo.id, !todo.completed);
  }

  return (
    <div data-cy="Todo" className={todo.completed ? 'todo completed' : 'todo'}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={handleChangeTodo}
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
        onClick={handleRemove}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay', {
            'is-active': loading?.includes(todo.id),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
