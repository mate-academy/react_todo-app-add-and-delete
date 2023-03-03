import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  temp?: boolean,
  deleteTodo?: (id:number) => void
};

export const Item: React.FC<Props> = ({ todo, temp, deleteTodo }) => {
  const [loader, setLoader] = useState(false);

  const activeLoader = () => {
    if (deleteTodo) {
      deleteTodo(todo.id);
      setLoader(true);
    }
  };

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

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={activeLoader}
      >
        ×

      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className={
        classNames('modal overlay', {
          'is-active': temp || loader,
        })
      }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
