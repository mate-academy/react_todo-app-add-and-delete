import { FC, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDeleteTodo: (id: number) => void;
  addingNewTodo: boolean;
  deletingCompletedTodos: boolean;
};

export const TodoInfo: FC<Props> = ({
  todo,
  onDeleteTodo,
  addingNewTodo,
  deletingCompletedTodos,
}) => {
  const { id, completed } = todo;
  const [deletingTodo, setDeletingTodo] = useState(false);

  const handleDeleteTodo = () => {
    setDeletingTodo(true);
    onDeleteTodo(id);
  };

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo', {
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

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={handleDeleteTodo}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal',
          'overlay',
          {
            'is-active': addingNewTodo
              || deletingTodo
              || (todo.completed && deletingCompletedTodos),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
