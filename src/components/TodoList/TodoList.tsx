import cn from 'classnames';
import { Todo } from '../../types/Todo';

type TodoListProps = {
  displayedTodos: () => Todo[];
  handleCompletedStatus: (todo: Todo) => void;
  editTodo: Todo | null;
  handleFormSubmitEdited: (
    event: React.FormEvent<HTMLFormElement>,
    editTodo: Todo) => void;
  handleEditTodo: (event: React.ChangeEvent<HTMLInputElement>) => void;
  editTitle: string;
  handleDoubleClick: (todo: Todo) => void;
  handleDelete: (todo: Todo) => void;
  editIsLoading: boolean;
  isLoadingCompleteStatus: boolean;
};

export const TodoList : React.FC<TodoListProps> = ({
  displayedTodos,
  handleCompletedStatus,
  editTodo,
  handleFormSubmitEdited,
  handleEditTodo,
  editTitle,
  handleDoubleClick,
  handleDelete,
  editIsLoading,
  isLoadingCompleteStatus,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">

      {displayedTodos().map((todo) => {
        return (
          <div
            data-cy="Todo"
            className={cn('todo', {
              completed: todo.completed,
            })}
            key={todo.id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => handleCompletedStatus(todo)}
              />
            </label>

            {editTodo?.id === todo.id
              ? (
                <form
                  onSubmit={(event) => handleFormSubmitEdited(
                    event, editTodo,
                  )}
                >
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={editTitle}
                    onChange={
                      (event) => handleEditTodo(event)
                    }
                  />
                </form>
              )
              : (
                <>
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => handleDoubleClick(todo)}
                  >
                    {todo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => handleDelete(todo)}
                  >
                    ×
                  </button>

                  <div
                    data-cy="TodoLoader"
                    className={cn('modal', 'overlay', {
                      'is-active': editIsLoading,
                    })}
                  >
                    <div
                      className="modal-background has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                </>

              )}

            {/* overlay will cover the todo while it is being updated */}

          </div>
        );
      })}
    </section>
  );
};
