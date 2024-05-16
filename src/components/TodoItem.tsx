/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Dispatch, FC } from 'react';

import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { deleteTodos } from '../api/todos';

interface Props {
  todo: Todo;
  onErrorMessage: (message: string) => void;
  setTodos: Dispatch<React.SetStateAction<Todo[]>>;
  setDeletingId: Dispatch<React.SetStateAction<number>>;
  deletingId: number;
}
const TodoItem: FC<Props> = ({
  todo,
  onErrorMessage,
  setTodos,
  setDeletingId,
  deletingId,
}) => {
  const handleDeleteTodo = (id: number) => {
    setDeletingId(id);
    deleteTodos(id)
      .then(() =>
        setTodos((prevState: Todo[]) => prevState.filter(t => t.id !== id)),
      )
      .catch(() => onErrorMessage('Unable to delete a todo'))
      .finally(() => setDeletingId(0));
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', {
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
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${todo.id === 0 || deletingId === todo.id ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
