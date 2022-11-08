/* eslint-disable @typescript-eslint/no-unused-vars */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isAdding: boolean,
  isLoader: boolean,
  selectedTodoId: number | null,
  completedTodosIds: number[],
  handlerTodoDeleteButton: (id: number) => void,
  isLoaderCompletedTodo: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isAdding,
  isLoader,
  selectedTodoId,
  completedTodosIds,
  isLoaderCompletedTodo,
  handlerTodoDeleteButton,
}) => {
  const { title, completed, id } = todo;

  const conditionForLoader = (isAdding && id === 0)
  || (isLoader && selectedTodoId === id)
  || (isLoaderCompletedTodo && completedTodosIds.includes(id));

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
        onClick={() => handlerTodoDeleteButton(id)}
      >
        ×
      </button>

      {conditionForLoader && (
        <div
          data-cy="TodoLoader"
          className="modal overlay is-active"
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
