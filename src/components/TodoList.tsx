import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  sortedTodoes: Todo[];
  onDelete: (id: number) => void;
  loadingIds: number[];
  todoStatus: (todo: Todo) => void;
  renameTodo: (todo: Todo, title: string) => void;
  setEditingId: (id: number | null) => void;
  editingId: number | null;
}

export const TodoList: React.FC<Props> = ({
  sortedTodoes,
  onDelete,
  loadingIds,
  todoStatus,
  renameTodo,
  setEditingId,
  editingId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {sortedTodoes.map(todo => {
        const isLoading = loadingIds.includes(todo.id);
        const isEditing = editingId === todo.id;

        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={classNames('todo', {
              completed: todo.completed,
              'is-editing': isEditing,
            })}
          >
            <label className="todo__status-label">
              <input
                aria-label="Mark todo as completed"
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => todoStatus(todo)}
              />
            </label>

            {isEditing ? (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const input = e.currentTarget.querySelector('input');

                  if (input) {
                    renameTodo(todo, input.value);
                  }
                }}
              >
                <input
                  autoFocus
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  defaultValue={todo.title}
                  onBlur={e => renameTodo(todo, e.target.value)}
                  onKeyUp={e => {
                    if (e.key === 'Escape') {
                      setEditingId(null);
                    }
                  }}
                />
              </form>
            ) : (
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => setEditingId(todo.id)}
              >
                {todo.title}
              </span>
            )}

            {!isEditing && (
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => onDelete(todo.id)}
              >
                ×
              </button>
            )}

            <div
              data-cy="TodoLoader"
              className={classNames('modal', 'overlay', {
                'is-active': isLoading,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>
  );
};
