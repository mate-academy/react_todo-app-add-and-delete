import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type TodoItemProps = {
  todo: Todo;
  loading: number[];
  handleDeleteTodo: (todoId: number) => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  loading,
  handleDeleteTodo,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
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

      <Loader todo={todo} loading={loading} />
    </div>
  );
};
