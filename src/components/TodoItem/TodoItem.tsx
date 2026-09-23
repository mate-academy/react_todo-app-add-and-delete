import { useState } from 'react';
import cn from 'classnames';

import type { TempTodo, Todo } from '../../types/Todo';

type Props = {
  todo: Todo | TempTodo | null;
  isLoading: boolean;
  onTodoDelete: (todoId: number) => void;
};

export const TodoItem = ({ todo, isLoading, onTodoDelete }: Props) => {
  const [isEditing] = useState(false);

  if (!todo) {
    return null;
  }

  const handleTodoDelete = () => {
    if (!todo) {
      return;
    }

    onTodoDelete(todo.id);
  };

  const isCompleted = 'completed' in todo ? todo.completed : false;

  return (
    <div data-cy="Todo" className={cn('todo', { completed: isCompleted })}>
      {/*eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
      <label className="todo__status-label">
        <input
          name="todoStatus"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
        />
      </label>
      {isEditing ? (
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
            {todo?.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleTodoDelete()}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todo.id === 0 || isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
