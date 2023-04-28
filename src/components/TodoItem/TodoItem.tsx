import classNames from 'classnames';
import { Dispatch, SetStateAction, useState } from 'react';
import { deleteTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  isLoading?: boolean;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setError: Dispatch<SetStateAction<string | null>>;
}
export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  setTodos,
  setError,
}) => {
  const [isTodoDeleting, setIsTodoDeleting] = useState(false);

  const handleTodoDelete = () => {
    setIsTodoDeleting(true);

    deleteTodo(todo.id)
      .then(() => {
        return setTodos((prevTodos: Todo[]) => {
          return prevTodos.filter((currentTodo) => currentTodo.id !== todo.id);
        });
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setIsTodoDeleting(false);
      });
  };

  return (
    <div className={classNames('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input type="checkbox" className="todo__status" checked />
      </label>

      <span className="todo__title">{todo.title}</span>

      {/* Remove button appears only on hover */}
      <button type="button" className="todo__remove" onClick={handleTodoDelete}>
        ×
      </button>

      <div
        className={classNames('modal', 'overlay', {
          'is-active': isLoading || isTodoDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
