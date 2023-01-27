import cn from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from './Loader';

type Props = {
  preaperedTodo: Todo[];
  newTempTodo: Todo | null;
  deletingTodoIds: number[];
  onDelete: (todoId: number) => Promise<boolean>;
};

export const Content: React.FC<Props> = ({
  preaperedTodo,
  newTempTodo,
  deletingTodoIds,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {preaperedTodo.map(todo => (
        <div
          data-cy="Todo"
          key={todo.id}
          className={cn('todo',
            { completed: todo.completed === true })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">{todo.title }</span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>

          <Loader isDelete={deletingTodoIds} todoId={todo.id} />
        </div>
      ))}

      {newTempTodo && (
        <div
          data-cy="Todo"
          className={cn('todo',
            { completed: newTempTodo.completed === true })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {newTempTodo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => onDelete(newTempTodo.id)}
          >
            ×
          </button>
          <Loader isDelete={deletingTodoIds} todoId={newTempTodo.id} />
        </div>
      )}
    </section>
  );
};
