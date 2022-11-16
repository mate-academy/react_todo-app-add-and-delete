import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';

type Props = {
  todos: Todo[];
  onDelete(arg0: number): void;
  deletedTodosId: number[];
  isAdding: boolean;
  temporaryTodoTitle: string;
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  onDelete,
  deletedTodosId,
  isAdding,
  temporaryTodoTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames(
            'todo',
            { completed: todo.completed },
          )}
          key={todo.id}
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
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>

          {deletedTodosId.includes(todo.id) && <Loader />}
        </div>
      ))}

      {isAdding && (
        <div
          data-cy="Todo"
          className="todo"
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              defaultChecked
            />
          </label>
          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {temporaryTodoTitle}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
            ×
          </button>

          <Loader />
        </div>
      )}
    </section>
  );
});
