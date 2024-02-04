/* eslint-disable no-console */
import classNames from 'classnames';
import { useContext } from 'react';
import { Todo } from '../../types/Todo';
// eslint-disable-next-line import/no-cycle
import { TodoUpdateContext } from '../../TodosContext/TodosContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { removeTodo, changeTodo } = useContext(TodoUpdateContext);

  async function handleRemove(event: React.FormEvent<HTMLButtonElement>) {
    event.preventDefault();

    try {
      const deleteId: number = todo.id;

      removeTodo(deleteId);
    } catch (error) {
      throw new Error();
    } finally {
      console.log(`delete Todo by id  ${todo.id}`);
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
          onClick={() => changeTodo(todo.id, !todo.completed)}
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
      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
