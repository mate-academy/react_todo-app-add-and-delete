/* eslint-disable operator-linebreak */
import classNames from 'classnames';
import { useContext } from 'react';
import { TodoLoader } from './TodoLoader';
import { Todo } from '../types/Todo';
import { TodoContext } from '../contexts/TodoContext';
import * as TodoClient from '../api/todos';
import { ErrorsMessage } from '../types/ErrorsMessage';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { id, title, completed } = todo;
  const { deleteTodo, handleSetErrorMessage, handleUpdatingTodosIds } =
    useContext(TodoContext);

  const handleDeleteTodo = (deleteTodoID: number) => {
    handleUpdatingTodosIds(deleteTodoID);

    TodoClient.deleteTodo(deleteTodoID)
      .then(() => deleteTodo(deleteTodoID))
      .catch(() => handleSetErrorMessage(ErrorsMessage.Delete))
      .finally(() => handleUpdatingTodosIds(null));
  };

  return (
    <li
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(id)}
      >
        ×
      </button>

      <TodoLoader id={id} />
    </li>
  );
};
