import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../loader/Loader';
import { useState } from 'react';

type Props = {
  todo: Todo;
  deleteTodo: (postId: number) => Promise<void>;
  tempLoader?: boolean;
};

export const TodoItem: React.FC<Props> = ({ todo, deleteTodo, tempLoader }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = (id: number) => {
    setLoading(true);
    deleteTodo(id).then(() => {
      setLoading(false);
    });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor={`todo-${todo.id}`} className="todo__status-label">
        <input
          data-cy="TodoStatus"
          id={`todo-${todo.id}`}
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      {/* <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value="Todo is being edited now"
              />
            </form> 

    */}

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <Loader loading={loading || tempLoader} />
    </div>
  );
};
