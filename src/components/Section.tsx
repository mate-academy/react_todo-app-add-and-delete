import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  filteredTodos: Todo[] | [];
  removeTodo: (param: number) => void;
  isAdding: boolean;
  selectedId: number[];
};

export const Section: React.FC<Props> = ({
  filteredTodos,
  removeTodo,
  isAdding,
  selectedId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos?.map((todo) => {
        const { title, completed, id } = todo;

        return (
          <div
            data-cy="Todo"
            key={id}
            className={classNames(
              'todo',
              {
                completed,
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

            <span
              data-cy="TodoTitle"
              className="todo__title"
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => removeTodo(id)}
            >
              ×
            </button>

            {selectedId.includes(id) && (
              <div
                data-cy="TodoLoader"
                className="modal overlay is-active"
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader is-loading " />
              </div>
            )}

            {(isAdding && selectedId.includes(id)) && (
              <div
                data-cy="TodoLoader"
                className="modal overlay is-active"
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader is-loading " />
              </div>
            )}
          </div>
        );
      })}

    </section>
  );
};
