import { FC, useContext } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../TodoContext';

type Props = {
  todo: Todo;
  isLoading?: boolean;
};

export const TodoInfo: FC<Props> = ({
  todo,
  isLoading = false,
}) => {
  const { onDeleteTodo, selectedTodoIds } = useContext(TodoContext);

  const isDeleting = selectedTodoIds.includes(todo.id);

  return (
    <div className={classNames('todo', {
      completed: todo.completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDeleteTodo(todo.id)}
      >
        ×
      </button>

      <div className={classNames('modal overlay', {
        'is-active': isLoading || isDeleting,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
