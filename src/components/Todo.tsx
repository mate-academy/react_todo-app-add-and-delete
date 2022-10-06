import classnames from 'classnames';
import React from 'react';
import { Loader } from './Loader';
import { Todo } from '../types/Todo';

type Props = {
  isAdding: boolean,
  todo: Todo,
  deleteTodo:(param: number) => void,
  loadingTodoIds: number[],
};

export const Todos: React.FC<Props> = ({
  isAdding,
  todo,
  deleteTodo,
  loadingTodoIds,
}) => {
  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classnames(
        'todo',
        {
          completed: todo.completed === true,
        },
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
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      {((isAdding && todo.id === 0) || loadingTodoIds.includes(todo.id)) && (
        <Loader />
      )}

    </div>
  );
};
