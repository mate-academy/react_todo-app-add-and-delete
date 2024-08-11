import { FC, useState, useEffect } from 'react';
import { Todo } from '../../types/Todo/Todo';
import classNames from 'classnames';
import { useTodoContext } from '../../context/TodoContext';
import { useTodoActions } from '../../utils/hooks/useTodoActions';
import { ErrorMessages } from '../../types/ErrorMessages/ErrorMessages';

type Props = { todo: Todo };

export const TodoItem: FC<Props> = ({ todo }) => {
  const {
    loadingTodoIds,
    showError,
    setLoadingTodoIds,
    editTodoId,
    setEditTodoId,
    setLockedFocus,
  } = useTodoContext();
  const { deleteTodo, editTodo } = useTodoActions();
  const [activeEdit, setActiveEdit] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [completed, setCompleted] = useState<boolean>(todo.completed);

  const handleSubmitEdit = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    setLoadingTodoIds([todo.id]);
    const normalizeTitle = title.trim();

    if (!normalizeTitle) {
      showError(ErrorMessages.Empty);
      setLoadingTodoIds(null);

      return;
    }

    try {
      await editTodo(todo.id, { title });
    } catch (error) {
      setTitle(title);
      setLockedFocus(true);
    } finally {
      setEditTodoId(null);
      setLoadingTodoIds(null);
    }
  };

  const handleToggleCompleted = async () => {
    setLoadingTodoIds([todo.id]);
    try {
      await editTodo(todo.id, { completed: !completed });
      setCompleted(prev => !prev);
    } catch (error) {
      showError(ErrorMessages.Edit);
    } finally {
      setLoadingTodoIds(null);
    }
  };

  useEffect(() => {
    if (activeEdit && editTodoId === todo.id) {
      setTitle(todo.title);
    }
  }, [editTodoId, activeEdit, todo.title, todo.id]);

  useEffect(() => {
    setCompleted(todo.completed);
  }, [todo.completed]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', 'item-enter-done', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          aria-label={`Mark ${title} as ${completed ? 'incomplete' : 'complete'}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToggleCompleted}
        />
      </label>

      {activeEdit && editTodoId === todo.id ? (
        <form onSubmit={handleSubmitEdit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              if (todo.completed === false) {
                setEditTodoId(todo.id);
                setActiveEdit(true);
                setLockedFocus(true);
              }
            }}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo([todo.id])}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodoIds?.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
