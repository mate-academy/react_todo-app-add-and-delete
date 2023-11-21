import { useContext, useState } from 'react';
import cn from 'classnames';
import { TodosContext } from '../context/TodoContext';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import { ErrorType } from '../types/Errors';

type TodoInfoProps = {
  todo: Todo;
};

export const TodoInfo = ({ todo }: TodoInfoProps) => {
  const {
    deleteTodo: deleteTodoLocaly,
    handleError,
  } = useContext(TodosContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = () => {
    setIsLoading(true);
    deleteTodo(todo.id)
      .then(() => deleteTodoLocaly(todo.id))
      .catch(() => handleError(ErrorType.Delete))
      .finally(() => setIsLoading(false));
  };

  return (
    <div
      data-cy="Todo"
      className={cn({
        todo: true,
        completed: !!todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          title="todoInput"
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
        onClick={handleDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn({
          'modal overlay': true,
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
