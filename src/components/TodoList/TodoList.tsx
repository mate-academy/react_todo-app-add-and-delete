import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodoIds: number[];
  onToggledTodo: (todo: Todo) => void;
  onDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodoIds,
  onToggledTodo,
  onDelete,
}) => {
  const visibleTodos = [...todos, ...(tempTodo ? [tempTodo] : [])];

  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        {visibleTodos.map(todo => (
          <div
            data-cy="Todo"
            className={classNames('todo', { completed: todo.completed })}
            key={todo.id}
          >
            <label className="todo__status-label" aria-label="Toggle todo">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => onToggledTodo(todo)}
              />
            </label>
            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete(todo.id)}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active':
                  loadingTodoIds.includes(todo.id) || tempTodo?.id === todo.id,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))}
      </section>
    </>
  );
};
