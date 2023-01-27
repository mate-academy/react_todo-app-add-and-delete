import cn from 'classnames';
import { memo } from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo;
  temporary?: boolean,
  isDeleting?: boolean,
  todoForDeleltingIds?: number[],
  deleteTodo?: (todoId: number) => Promise<void>,
};

export const TodoItem: React.FC<Props> = memo((props) => {
  const {
    todo,
    temporary = false,
    isDeleting,
    todoForDeleltingIds,
    deleteTodo = () => {},
  } = props;

  const isLoading = temporary
    || (isDeleting && todoForDeleltingIds?.includes(todo.id));

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      {/* eslint-disable-next-line max-len */}
      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      {isLoading && <Loader />}
    </div>
  );
});
