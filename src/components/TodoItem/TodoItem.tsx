/* eslint-disable @typescript-eslint/no-unused-vars */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isAdding: boolean,
  isRemoving: boolean,
  selectedTodoId: number | null,
  completedTodosIds: number[],
  handleTodoDeleteButton: (id: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isAdding,
  isRemoving,
  selectedTodoId,
  completedTodosIds,
  handleTodoDeleteButton,
}) => {
  const { title, completed, id } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
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
        onClick={() => handleTodoDeleteButton(id)}
      >
        ×
      </button>

      {(((isAdding && id === 0) || (isRemoving && (selectedTodoId === id
      || completedTodosIds.includes(id)))) && (
        <div
          data-cy="TodoLoader"
          className="modal overlay is-active"
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      ))}
    </div>
  );
};
