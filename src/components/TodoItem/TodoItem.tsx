import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (id: number) => Promise<void>;
  isAdding: boolean;
  isDeleting: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  isAdding,
  isDeleting,
}) => {
  const [selectedTodoId, setSelectedTodoId] = useState(0);
  const {
    userId,
    title,
    completed,
    id,
  } = todo;

  const onDeleteTodo = () => {
    setSelectedTodoId(id);

    removeTodo(id).catch(() => setSelectedTodoId(0));
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
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

      <span data-cy="TodoTitle" className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={onDeleteTodo}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active':
              (isAdding && userId === -1)
              || (selectedTodoId)
              || (isDeleting && completed),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
