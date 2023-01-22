import { FC, memo, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDeleteItem: (todoId: number) => void
}

export const TodoItem: FC<Props> = memo(
  ({ todo, onDeleteItem }) => {
    const [selectedTodo] = useState(0);

    return (
      <div
        data-cy="Todo"
        className={cn(
          'todo', { completed: todo.completed },
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

        <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={() => onDeleteItem(todo.id)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          // className="modal overlay"
          className={cn('modal overlay', {
            'is-active': selectedTodo === todo.id,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
