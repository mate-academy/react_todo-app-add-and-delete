import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Loader } from './Loader';

type Props = {
  todo: Todo;
  loadingIds: number[];
  handleDeleteTodo: (todoId: number) => void;
};

export const TodoItem = ({ todo, loadingIds, handleDeleteTodo }: Props) => {
  return (
    <div
      key={todo.id}
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
      <Loader loadingIds={loadingIds} todoId={todo.id} />
    </div>
  );
};
