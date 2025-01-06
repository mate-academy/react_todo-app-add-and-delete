import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todoItem: Todo;
  updateCompleted: (todoItem: Todo) => void;
  isLoadingIds: number[];
  changeTodoId: number | null;
  newTitle: string;
  setNewTitle: (e: string) => void;
  handleDoubleClick: (todoItem: Todo) => void;
  handleKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    todoItem: Todo,
  ) => void;
  handleBlur: (todoItem: Todo) => void;
  deleteTodoHandler: (todoId: number) => void;
};
export const TodoItem: React.FC<Props> = ({
  todoItem,
  updateCompleted,
  isLoadingIds,
  changeTodoId,
  newTitle,
  setNewTitle,
  handleDoubleClick,
  handleKeyDown,
  handleBlur,
  deleteTodoHandler,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  return (
    <div
      data-cy="Todo"
      key={todoItem.id}
      className={classNames('todo', { completed: todoItem.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todoItem.completed}
          onChange={() => updateCompleted(todoItem)}
          aria-label={`Mark as ${todoItem.completed ? FilterType.Active : FilterType.Completed}`}
        />
      </label>

      {changeTodoId === todoItem.id ? (
        <input
          className="todo__title-field"
          value={newTitle}
          onChange={handleChange}
          onBlur={() => handleBlur(todoItem)}
          onKeyDown={e => handleKeyDown(e, todoItem)}
          autoFocus
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => handleDoubleClick(todoItem)}
        >
          {todoItem.title}
        </span>
      )}

      {changeTodoId !== todoItem.id && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodoHandler(todoItem.id)}
        >
          ×
        </button>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoadingIds.includes(todoItem.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
