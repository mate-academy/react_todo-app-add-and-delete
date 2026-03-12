import { useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { deleteTodo, patchTodo } from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  todo: Todo;
  updateTodos?: (todos: Todo[]) => void;
  setError?: (message: ErrorMessage) => void;
  onFocuseInput?: (focuse: boolean) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  updateTodos,
  setError,
  onFocuseInput,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [query, setQuery] = useState(todo.title);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteTodo = () => {
    setIsLoading(true);
    onFocuseInput(false);
    deleteTodo(todo.id)
      .then(() => updateTodos(prev => prev.filter(item => item.id !== todo.id)))
      .catch(() => setError(ErrorMessage.unableDelete))
      .finally(() => {
        setIsLoading(false);
        onFocuseInput(true);
      });
  };

  const handlePatchTodo = (item: Todo) => {
    setIsLoading(true);
    patchTodo(item)
      .then(response =>
        updateTodos((currentTodos: Todo[]) =>
          currentTodos.map(todoItem =>
            todoItem.id === response.id ? response : todoItem,
          ),
        ),
      )
      .catch(() => setError(ErrorMessage.unableUpdate))
      .finally(() => setIsLoading(false));
  };

  const handleChangeStatus = () => {
    const newTodo = { ...todo, completed: !todo.completed };

    handlePatchTodo(newTodo);
  };

  const handleSubmitChangeTitle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newTodo = { ...todo, title: query };

    handlePatchTodo(newTodo);

    setIsEditing(false);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {/*eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleChangeStatus}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmitChangeTitle}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={query}
            autoFocus
            onChange={event => setQuery(event.target.value)}
            onBlur={() => setIsEditing(false)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoading || !(updateTodos && setError),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
