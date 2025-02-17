import React from 'react';
import cn from 'classnames';

import { TodoContext } from '../../Context/TodoContext';

import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { Error } from '../../types/Error';

type TodoInfoProps = {
  todo: Todo;
};

export const TodoInfo: React.FC<TodoInfoProps> = ({ todo }) => {
  const { deleteTodoLocal, setError, focusInput } =
    React.useContext(TodoContext);

  const [isLoading, setIsLoading] = React.useState(false);

  const isTempTodo = todo.id === 0;

  const handleDeleteTodo = (id: number) => () => {
    setIsLoading(true);

    deleteTodo(id)
      .then(() => {
        deleteTodoLocal(id);
      })
      .catch(() => {
        setError(Error.DeleteTodo);
      })
      .finally(() => {
        setIsLoading(false);
      });
    focusInput();
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor="todoStatus" className="todo__status-label">
        <input
          id="todoStatus"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => {}}
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
        onClick={handleDeleteTodo(todo.id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isTempTodo || isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
