/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import TodoLoader from './TodoLoader';
import { deleteTodo } from '../api/todos';
import { Errors } from '../types/Error';

type TodoItemProps = {
  todo: Todo;
  isPending?: boolean;
  onError: (message: Errors) => void;
  onDelete: (id: number) => void;
  onSetLoading: (ids: number[]) => void;
};
function TodoItem({
  todo,
  isPending = false,
  onError,
  onDelete,
  onSetLoading,
}: TodoItemProps) {
  async function handleDelete() {
    onSetLoading([todo.id]);
    try {
      const { id } = todo;

      await deleteTodo(id);
      onDelete(id);
    } catch (error) {
      onError(Errors.DeleteTodo);
    } finally {
      onSetLoading([]);
    }
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
      >
        ×
      </button>

      <TodoLoader isLoading={isPending} />
    </div>
  );
}

export default TodoItem;
