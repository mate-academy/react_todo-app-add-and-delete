import { FunctionComponent } from 'react';
import classnames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';

interface TodoItemProps {
  todo: Todo;
  removeTodoHandler: (todoId: number) => void;
  onLoading: boolean;
}
export const TodoItem: FunctionComponent<TodoItemProps> = ({
  todo,
  removeTodoHandler,
  onLoading,
}) => {
  const { title, completed, id } = todo;

  return (
    <div
      data-cy="Todo"
      className={classnames('todo', {
        'todo completed': completed,
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
        onClick={() => removeTodoHandler(id)}
      >
        ×
      </button>

      <Loader isLoading={onLoading} />
    </div>
  );
};
