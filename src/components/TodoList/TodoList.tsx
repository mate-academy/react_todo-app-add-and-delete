import React, { useCallback, useMemo, useState } from 'react';

import classNames from 'classnames';
import { Loader } from '../Loader';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  status: string,
  newTodoTitle: string,
  isAdding: boolean,
  onDelete: (todoId: number) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  status,
  newTodoTitle,
  isAdding,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingTodoIds, setDeletingTodoIds] = useState([0]);

  const getFilteredTodos = useCallback((): Todo[] => {
    return todos.filter(todo => {
      switch (status) {
        case 'active':
          return !todo.completed;
        case 'completed':
          return todo.completed;
        case 'all':
        default:
          return todos;
      }
    });
  }, [todos, status]);

  const filteredTodos = useMemo(
    getFilteredTodos,
    [todos, status],
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => {
        const {
          id,
          title,
          completed,
        } = todo;

        return (
          <div
            data-cy="Todo"
            className={classNames(
              'todo',
              { completed },
            )}
            key={id}
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
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                setDeletingTodoIds(previousIds => [...previousIds, id]);
                setIsDeleting(true);
                onDelete(id);
              }}
            >
              ×
            </button>

            <Loader
              isDeleting={isDeleting}
              id={id}
              deletingTodoIds={deletingTodoIds}
            />

          </div>

        );
      })}

      {isAdding && (
        <div
          data-cy="Todo"
          key="0"
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

          <span data-cy="TodoTitle" className="todo__title">
            {newTodoTitle}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
            ×
          </button>

          <Loader
            isAdding={isAdding}
          />
        </div>
      )}

    </section>
  );
};
