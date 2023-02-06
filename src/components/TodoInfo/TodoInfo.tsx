import { memo } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo,
  removeTodo: (todoId: number) => void,
  isLoading: boolean,
  isDeleting: boolean,
};

export const TodoInfo: React.FC <Props> = memo(({
  todo,
  removeTodo,
  isLoading,
  isDeleting,

}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => removeTodo(todo.id)}
      >
        ×
      </button>

      { (isDeleting || todo.id === 0) && (
        <Loader
          isLoading={isLoading}
          isDeleting={isDeleting}
        />
      )}

    </div>
  );
});
