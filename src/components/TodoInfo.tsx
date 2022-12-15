import classNames from 'classnames';
import { removeTodo } from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  loadTodos: () => void,
  todosToRemove: number[],
  onSetTodosToRemove: (idToRemove: number) => void,
};

export const TodoInfo: React.FC<Props> = (
  {
    todo,
    loadTodos,
    todosToRemove,
    onSetTodosToRemove,
  },
) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const onDeleteTodo = async () => {
    onSetTodosToRemove(id);

    await removeTodo(id);

    loadTodos();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={onDeleteTodo}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': todosToRemove.includes(id),
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
