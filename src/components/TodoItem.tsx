import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo,
  deleteTodoById: (todoId: number) => void,
  isLoading: boolean,
  completedTodos: Todo[],
}

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodoById,
  isLoading,
  completedTodos,
}) => {
  const handleDeleteTodo = (todoForDelete: Todo) => {
    deleteTodoById(todoForDelete.id);
  };

  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDeleteTodo(todo)}
        disabled={isLoading}
      >
        ×
      </button>

      <div className={classNames('modal', 'overlay', {
        'is-active': isLoading && completedTodos.includes(todo),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
