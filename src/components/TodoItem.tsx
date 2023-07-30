import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Loader } from './Loader';

type Props = {
  todo: Todo;
  handleToggleCompleted: (id: number) => void,
  handleDeleteTodo: (id: number) => void,
  isLoadingTodoIds: number[],
};

export const TodoItem: React.FC<Props> = ({
  todo, handleToggleCompleted, handleDeleteTodo,
  isLoadingTodoIds,
}) => {
  return (
    <div
      key={todo.id}
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggleCompleted(todo.id)}
        />
      </label>
      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×
      </button>

      {isLoadingTodoIds.includes(todo.id) && <Loader />}
    </div>
  );
};
