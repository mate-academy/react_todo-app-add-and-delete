import classNames from 'classnames';
import { FormEvent } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  handleDelete: (
    todoId: number,
  ) => void,
  selectedTodos: number[],
  setSelectTodos: (userId: number[]) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDelete,
  selectedTodos,
  setSelectTodos,
}) => {
  const handleRemove = (event: FormEvent) => {
    event.preventDefault();
    handleDelete(todo.id);
    setSelectTodos([todo.id]);
  };

  return (
    <>
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={(event) => handleRemove(event)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={classNames(
            'modal overlay',
            { 'is-active': selectedTodos.includes(todo.id) || todo.id === 0 },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
