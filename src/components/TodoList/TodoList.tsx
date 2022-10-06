import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  removeTodo:(todoId: number) => void;
  updateState:(todoId: number, property: Partial<Todo>) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  updateState,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const { id, title, completed } = todo;

        return (
          <div
            data-cy="Todo"
            className={classNames('todo', { completed })}
            key={id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                onChange={() => updateState(id, { completed: !completed })}
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">{title}</span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => removeTodo(id)}
            >
              ×
            </button>
          </div>
        );
      })}
    </section>
  );
};
