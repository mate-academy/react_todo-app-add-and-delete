import classNames from 'classnames';
import { FC, useContext, useState } from 'react';
import { deleteTodos } from '../../api/todos';
import { ErrorMessage, Todo } from '../../types';
import { TodosContext } from '../TodosContext/TodosContext';

interface Props {
  todo: Todo;
  todoLoading?: boolean;
}

export const TodoItem: FC<Props> = ({
  todo,
  todoLoading,
}) => {
  const [deleteTodoLoading, setDeleteTodoLoading] = useState(false);
  const {
    setTodos,
    setError,
    isTodoDeleting,
  } = useContext(TodosContext);
  const { id, completed, title } = todo;

  const handleTodoDelete = () => {
    setDeleteTodoLoading(true);

    deleteTodos(id)
      .then(() => setTodos((prevTodos: Todo[]) => (
        prevTodos.filter((prevTodo: Todo) => prevTodo.id !== id)
      )))
      .catch((error: Error) => {
        setError(ErrorMessage.Delete);
        throw new Error(error.message);
      }).finally(() => {
        setDeleteTodoLoading(false);
      });
  };

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          // checked
        />
      </label>

      <span className="todo__title">{ title }</span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleTodoDelete}
      >
        ×
      </button>

      <div className={classNames('modal overlay', {
        'is-active': todoLoading
        || deleteTodoLoading
        || isTodoDeleting?.includes(id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
