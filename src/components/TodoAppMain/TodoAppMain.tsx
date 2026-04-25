import React, { useCallback } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  selectedDeleteTodo: number | null;
  loaderDelete: boolean;
  todos: Todo[];
  tempTodo: Todo | null;
  loaderClearButton: boolean;
  onSelectedTodo: (todoId: number) => void;
};

export const TodoAppMain = React.memo<Props>(
  ({
    loaderClearButton,
    selectedDeleteTodo,
    loaderDelete,
    todos,
    tempTodo,
    onSelectedTodo,
  }) => {
    const clickButton = useCallback(
      (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        todoId: number,
      ) => {
        event.preventDefault();
        onSelectedTodo(todoId);
      },
      [],
    );

    return (
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => (
          <div
            key={todo.id}
            data-cy="Todo"
            className={classNames('todo item-enter-item', {
              completed: todo.completed,
            })}
          >
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                readOnly
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>

            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={event => clickButton(event, todo.id)}
            >
              ×
            </button>

            {/* overlay will cover the todo while it is being deleted or updated */}
            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay ', {
                'is-active':
                  todo.title === tempTodo?.title ||
                  (loaderDelete && todo.id === selectedDeleteTodo) ||
                  (loaderClearButton && todo.completed),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))}
      </section>
    );
  },
);

TodoAppMain.displayName = 'TodoAppMain';
