import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type TodoListProps = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  editTodoRef: React.RefObject<HTMLInputElement>;
  editingTodoId: number | null;
  updatedTitle: string;
  setUpdatedTitle: React.Dispatch<React.SetStateAction<string>>;
  setEditingTodoId: React.Dispatch<React.SetStateAction<number | null>>;
  changeTitleTodo: (selectedTodo: Todo) => void;
  handleUpdateTodo: (selectedTodo: Todo) => void;
  startEditTodo: (todo: Todo) => void;
  handleDeleteTodo: (todoId: number) => void;
  checkModalActive: (todo: Todo) => string;
  isTempTodoLoading: () => boolean;
};

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  tempTodo,
  editTodoRef,
  editingTodoId,
  updatedTitle,
  setUpdatedTitle,
  changeTitleTodo,
  handleUpdateTodo,
  setEditingTodoId,
  startEditTodo,
  handleDeleteTodo,
  checkModalActive,
  isTempTodoLoading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => {
        const { id, title, completed } = todo;

        return (
          <div
            data-cy="Todo"
            className={classNames('todo', {
              completed: completed,
            })}
            key={id}
          >
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={completed}
                onChange={() => {
                  handleUpdateTodo(
                    completed === false
                      ? { ...todo, completed: true }
                      : { ...todo, completed: false },
                  );
                }}
              />
            </label>

            {editingTodoId === id ? (
              <form>
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={updatedTitle}
                  onChange={event => setUpdatedTitle(event.target.value)}
                  onBlur={() => {
                    changeTitleTodo(todo);
                  }}
                  onKeyDown={event => {
                    if (event.key === 'Enter') {
                      changeTitleTodo(todo);
                    }

                    if (event.key === 'Escape') {
                      setEditingTodoId(null);
                    }
                  }}
                  ref={editTodoRef}
                />
              </form>
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => {
                    startEditTodo(todo);
                  }}
                >
                  {title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => {
                    handleDeleteTodo(id);
                  }}
                >
                  ×
                </button>
              </>
            )}

            <div data-cy="TodoLoader" className={checkModalActive(todo)}>
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}

      {tempTodo && (
        <div
          data-cy="Todo"
          className={`todo ${isTempTodoLoading() ? 'is-loading' : ''}`}
        >
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={tempTodo.completed}
            disabled
          />
          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>
          {isTempTodoLoading() && (
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </div>
      )}
    </section>
  );
};
