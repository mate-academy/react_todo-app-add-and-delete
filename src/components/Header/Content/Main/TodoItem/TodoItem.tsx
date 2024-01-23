import cn from 'classnames';
import { useContext } from 'react';
import { Todo } from '../../../../../types/Todo';
import { TodosContext } from '../../../../../Context/TodosContext';

type Props = {
  todo: Todo,
  isTempTodo?: boolean,
};

export const TodoItem: React.FC<Props> = ({ todo, isTempTodo }) => {
  const {
    // toggleTodoStatus,
    // handleUpdateTodo,
    handleDeleteTodo,
    loadingIds,
  } = useContext(TodosContext);

  const isTodoLoading = loadingIds.includes(todo.id);

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
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
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isTempTodo || isTodoLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
