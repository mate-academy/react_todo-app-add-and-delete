import { FC } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  activeIds: number[];
  handleRemoveTodo: (buttonId: number) => void;
};

export const TodoItem: FC<Props> = ({
  todo,
  activeIds,
  handleRemoveTodo,
}) => {
  const { title, completed, id } = todo;

  return (
    <div
      className={cn(
        'todo',
        'item-enter-done',
        { completed },
      )}
      data-cy="todo"
    >
      <div className="todo__status-label">
        <input type="checkbox" className="todo__status" />
      </div>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleRemoveTodo(id)}
      >
        ×
      </button>

      <div
        className={cn(
          'overlay',
          'modal',
          {
            'is-active': activeIds.some(activeId => activeId === id),
          },
        )}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
