import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
// import { USER_ID } from '../../utils/UserId';
import { TodosContext } from '../TodosContextProvider/TodosContextProvider';
import { ErrorContext } from '../ErrorContextProvider/ErrorContextProvider';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { onNewError } = useContext(ErrorContext);
  const { setTodos } = useContext(TodosContext);
  const { title, completed } = todo;
  const [isLoading, setIsLoading] = useState(false);

  const handleTodoDelete = (todoId: number) => {
    setIsLoading(true);
    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos
          .filter(({ id }) => id !== todoId));
      })
      .catch(() => onNewError('Unable to delete a todo'))
      .finally(() => setIsLoading(false));
  };

  return (
    <div
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

      <span className="todo__title" data-cy="TodoTitle">
        {title}
      </span>
      <button
        data-cy="TodoDelete"
        type="button"
        className="todo__remove"
        onClick={() => handleTodoDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading || todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
