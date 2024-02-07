/* eslint-disable no-console */
import classNames from 'classnames';
import { useContext } from 'react';
import { Todo } from '../../types/Todo';
// eslint-disable-next-line import/no-cycle
import {
  LoadingContext,
  TodoUpdateContext,
} from '../../TodosContext/TodosContext';
import { addLoadingIds } from '../../services/changeLoadingIds';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { removeTodo, changeTodo } = useContext(TodoUpdateContext);
  const { loading, setLoading } = useContext(LoadingContext);

  function handleRemove(event: React.FormEvent<HTMLButtonElement>) {
    event.preventDefault();
    setLoading(addLoadingIds(todo.id, loading));
    try {
      const deleteId: number = todo.id;

      removeTodo(deleteId);
    } finally {
      console.log(`delete Todo by id  ${todo.id}`);
    }
  }

  function handleChangeTodo() {
    setLoading(addLoadingIds(todo.id, loading));
    try {
      changeTodo(todo.id, !todo.completed);
    } catch (error) {
      throw new Error('HandleChangeTodo in TodoItem');
    }
  }

  const isCompleted = classNames({
    'todo completed': todo.completed,
    // eslint-disable-next-line quote-props
    'todo': todo.completed === false,
  });

  return (
    <div data-cy="Todo" className={isCompleted}>
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
      { loading && loading.includes(todo.id) && (
        <div
          data-cy="TodoLoader"
          className="modal overlay is-active"
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
