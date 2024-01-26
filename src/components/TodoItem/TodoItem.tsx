import cn from 'classnames';
import { useContext, useState } from 'react';
import { Todo } from '../../types/Todo';
import { removeTodo } from '../../api/todos';
import { TodosContext } from '../TodosContext/TodosContext';
import { ErrorMessage } from '../../types/ErrorMessages';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    todos,
    setTodos,
    handleErrorMessage,
    isLoadingAll,
  } = useContext(TodosContext);

  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveTodo = () => {
    setIsLoading(true);

    removeTodo(todo.id)
      .then(() => setTodos(todos.filter(value => value.id !== todo.id)))
      .catch(() => {
        setTodos(todos);
        handleErrorMessage(ErrorMessage.UNABLE_DELETE);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
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
        onClick={handleRemoveTodo}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isLoading || (isLoadingAll && todo.completed),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
