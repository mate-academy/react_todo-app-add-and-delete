import cl from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDeleteTodo: (todoId: number) => void;
  changeStatus?: (stat: boolean) => void;
};

export const TodoListItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDeleteTodo,
}) => {
  // const checkBoxChangeHandle = (event: React.ChangeEvent<HTMLInputElement>) => {

  // }

  return (
    <div data-cy="Todo" className={cl('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          aria-label="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {}}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDeleteTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cl('modal overlay', {
          'is-active': todo.id === 0 || isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
