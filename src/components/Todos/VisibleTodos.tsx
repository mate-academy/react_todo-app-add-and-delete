import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { filterTodo } from '../../utils/filterTodos';

type Props = {
  todos: Todo[],
  onRemove: (todoId: number) => void,
  onComplete: (todoId: number, title: string, completed: boolean) => void,
  onTodoChange: (event: React.ChangeEvent<HTMLInputElement>,
    todoId: number) => void,
  onCurrentTodoChange: (event: React.FormEvent<HTMLFormElement> | null,
    title: string, todoId: number) => void,
  isForm: boolean,
  onFormComplete: () => void,
  status: string,
  activeTodoId: number[],
};

export const VisibleTodos: React.FC<Props> = ({
  todos,
  onRemove,
  onComplete,
  onTodoChange,
  onCurrentTodoChange,
  isForm,
  onFormComplete,
  status,
  activeTodoId,
}) => {
  return (
    <>
      {todos
        .filter(todo => filterTodo(todo, status))
        .map(({ id, completed, title }) => {
          const isModified = id === 0;
          const isActive = activeTodoId.includes(id);

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
                  checked={completed}
                  onChange={() => onComplete(id, title, !completed)}
                />
              </label>

              {!isForm && (
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onClick={onFormComplete}
                  aria-hidden="true"
                >
                  {title}
                </span>
              )}

              {isForm && (
                <form onSubmit={
                  (event) => onCurrentTodoChange(event, title, id)
                }
                >
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={title}
                    onChange={(event) => onTodoChange(event, id)}
                    onBlur={() => onCurrentTodoChange(null, title, id)}
                  />
                </form>
              )}

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={() => onRemove(id)}
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={classNames(
                  'modal overlay',
                  { 'is-active': isModified || isActive },
                )}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          );
        })}
    </>
  );
};
