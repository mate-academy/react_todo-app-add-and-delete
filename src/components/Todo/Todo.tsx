import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  spinner: boolean;
  onDeleteTodo: (todoId: number) => void;
  isDeleting: boolean;
  deletingCompleted: boolean;
};

const TodoComponent: React.FC<Props> = ({
  todo, spinner, onDeleteTodo, isDeleting, deletingCompleted,
}) => {
  const [hasSpinner, setHasSpinner] = useState(spinner);

  const isActive = todo.completed && deletingCompleted ? true : hasSpinner;

  useEffect(() => {
    if (!isDeleting) {
      setHasSpinner(false);
    }
  }, [isDeleting]);

  const deleteHandler = (todoId:number) => {
    onDeleteTodo(todoId);
    setHasSpinner(true);
  };

  return (
    <div
      data-cy="Todo"
      className={
        classNames('todo', {
          completed: todo.completed,
        })
      }
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => deleteHandler(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isActive })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoComponent;
