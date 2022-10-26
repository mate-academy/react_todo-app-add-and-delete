/* eslint-disable @typescript-eslint/no-unused-vars */
import classNames from 'classnames';
import { deleteTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isAdding: boolean,
  setIsError: (value: string | null) => void,
  isRemoving: boolean,
  setIsRemoving: (value: boolean) => void,
  selectedTodoId: number | null,
  setSelectedTodoId: (value : number | null) => void,
  completedTodosIds: number [],
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isAdding,
  setIsError,
  isRemoving,
  setIsRemoving,
  selectedTodoId,
  setSelectedTodoId,
  completedTodosIds,
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
        onClick={() => {
          setIsRemoving(true);
          setSelectedTodoId(id);
          deleteTodo(id)
            .then(() => setIsRemoving(false))
            .catch(error => {
              setIsError(`${error}: Unable to delete a todo`);
              setIsRemoving(false);
            });
        }}
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
