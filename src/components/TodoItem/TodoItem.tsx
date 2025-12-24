/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { TodoLoader } from '../TodoLoader';
import { RefObject } from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { StateSetter } from '../../types/StateSetter';

interface Props {
  todo: Todo;
  nodeRef: RefObject<HTMLDivElement>;
  setTodos: StateSetter<Todo[]>;
  setError: (msg: string, timeout?: number) => void;
  loadingIds: number[];
  addLoadingId: (postId: number) => void;
  removeLoadingId: (postId: number) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  nodeRef,
  setTodos,
  setError,
  loadingIds,
  addLoadingId,
  removeLoadingId,
}) => {
  const loading = loadingIds.includes(todo.id) || todo.id === 0;
  const editing = false;

  const handleDelete = async (todoId: number) => {
    addLoadingId(todoId);
    try {
      await deleteTodo(todoId);
      setTodos((currentTodos: Todo[]) =>
        currentTodos.filter(t => t.id !== todoId),
      );
    } catch {
      setError('Unable to delete a todo');
      removeLoadingId(todoId);
    }
  };

  return (
    <div
      data-cy="Todo"
      ref={nodeRef}
      className={classNames('todo', { completed: !!todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={!!todo.completed}
          readOnly
        />
      </label>

      {editing ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <TodoLoader isActive={loading} />
    </div>
  );
};
