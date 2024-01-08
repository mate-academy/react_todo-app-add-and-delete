import cn from 'classnames';
import { useTodoContext } from '../../context/TodosProvider';
import { Todo } from '../../types/Todo';

interface TodoCardProps {
  todo: Todo
}

export const TodoCard: React.FC<TodoCardProps> = ({ todo }) => {
  const {
    handleDeleteTodo,
    tempTodo,
    status,
    isToggled,
  } = useTodoContext();

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      {/* eslint jsx-a11y/label-has-associated-control: ["error", { assert: "either" } ] */}
      <label className="todo__status-label" htmlFor={`${todo.id}`}>
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={`${todo.id}`}
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active':
          todo.id === tempTodo?.id
          || status === todo.id
          || isToggled,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
