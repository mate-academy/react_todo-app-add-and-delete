import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  deleteTodo: (id: number) => void,
  completedTodos: Todo[],
  isDeleting: boolean,
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  deleteTodo,
  completedTodos,
  isDeleting,
}) => {
  const [todoIdToDelete, setTodoIdToDelete] = useState(0);

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => {
          setTodoIdToDelete(todo.id);
          deleteTodo(todo.id);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          {
            'is-active': todo.id === 0
              || todo.id === todoIdToDelete
              || (completedTodos.includes(todo) && isDeleting),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
