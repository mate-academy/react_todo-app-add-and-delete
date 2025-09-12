/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */

import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (idToDelete: number) => void;
  deletingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  deletingTodoIds,
}) => {
  const [edetingId, setEditingId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const todosToRender = tempTodo ? [...todos, tempTodo] : todos;

  useEffect(() => {
    if (edetingId !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [edetingId]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosToRender.map(todo => {
        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={classNames('todo', { completed: todo.completed })}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
              />
            </label>

            {edetingId === todo.id ? (
              <form>
                <input
                  ref={inputRef}
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  defaultValue={todo.title}
                />
              </form>
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => setEditingId(todo.id)}
                >
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
                {deletingTodoIds.includes(todo.id) && (
                  <div data-cy="TodoLoader" className="modal overlay is-active">
                    {/* eslint-disable-next-line max-len */}
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                )}
                {tempTodo && tempTodo.id === todo.id && (
                  <div data-cy="TodoLoader" className="modal overlay is-active">
                    {/* eslint-disable-next-line max-len */}
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </section>
  );
};
