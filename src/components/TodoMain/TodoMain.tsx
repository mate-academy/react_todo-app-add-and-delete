import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  selectedTodoIds: number[],
  onDelete: (todoId: number) => void,
};

export const TodoMain: React.FC<Props> = ({
  todos,
  tempTodo,
  selectedTodoIds,
  onDelete,
}) => {
  const isBeingEdited = false;
  const isBeingSaved = false;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isLoading = selectedTodoIds.includes(todo.id);

        return (
          <div
            data-cy="Todo"
            className={cn(
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
                checked={todo.completed}
              />
            </label>

            {isBeingEdited ? (
              <form>
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value="Todo is being edited now"
                />
              </form>
            ) : (
              <>
                <span data-cy="TodoTitle" className="todo__title">
                  {isBeingSaved ? (
                    'Todo is being saved now'
                  ) : (
                    todo.title
                  )}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => onDelete(todo.id)}
                >
                  ×
                </button>
              </>
            )}

            <div
              data-cy="TodoLoader"
              className={cn(
                'modal',
                'overlay',
                { 'is-active': isLoading },
              )}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}

      {tempTodo && (
        <div data-cy="Todo" className="todo" key={tempTodo.id}>
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
