import { Todo } from '../../types/Todo';
import classNames from 'classnames';

interface TodoItemsProps {
  todo: Todo;
  loadingTodo: boolean;
  handleDelate: (todoId: number) => void;
}

export const TodoItems: React.FC<TodoItemsProps> = ({
  todo,
  loadingTodo,
  handleDelate,
}) => {
  const checkboxId = `todo-status-${todo.id}`;

  return (
    <div data-cy="Todo" className={todo.completed ? 'todo completed' : 'todo'}>
      <label className="todo__status-label" htmlFor={checkboxId}>
        {/* <label> */}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          id={checkboxId}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          handleDelate(todo.id);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': loadingTodo })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
