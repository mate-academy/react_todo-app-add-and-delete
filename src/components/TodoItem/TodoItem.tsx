import cn from 'classnames';
import { useContext } from 'react';
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
  } = useContext(TodosContext);

  const handleRemoveTodo = () => {
    setTodos(todos.filter(value => value.id !== todo.id));

    removeTodo(todo.id)
      .then()
      .catch(() => {
        setTodos(todos);
        handleErrorMessage(ErrorMessage.UNABLE_DELETE);
      });
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
        onClick={() => handleRemoveTodo()}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className="modal overlay"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
