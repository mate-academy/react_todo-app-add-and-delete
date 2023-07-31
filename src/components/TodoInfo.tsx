import classNames from 'classnames';
import { useContext } from 'react';
import { Todo } from '../types/Todo';
import { TodoContext } from '../context/TodoContext';

type Props = {
  todo: Todo,
  loading?: boolean,
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  loading = false,
}) => {
  const { deleteTodo } = useContext(TodoContext);

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
        />
      </label>

      <span className="todo__title">{todo.title}</span>
      <button
        onClick={() => deleteTodo(todo.id)}
        type="button"
        className="todo__remove"
      >
        ×
      </button>
      <div className={classNames('modal overlay', {
        'is-active': loading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
