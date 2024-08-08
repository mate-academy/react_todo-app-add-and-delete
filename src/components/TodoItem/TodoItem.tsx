import { FC, useState, useEffect } from 'react';
import { Todo } from '../../types/Todo/Todo';
import classNames from 'classnames';
import { useTodoContext } from '../../utils/hooks/useTodoContext';
import { TodoService } from '../../services/TodoService';
import { ErrorMessages } from '../../types/ErrorMessages/ErrorMessages';

type Props = { todo: Todo };

export const TodoItem: FC<Props> = ({ todo }) => {
  const {
    loading,
    showError,
    setLoading,
    editTodoId,
    setEditTodoId,
    setFocusInput,
  } = useTodoContext();
  const { deleteTodo, editTodo } = TodoService();
  const [activeEdit, setActiveEdit] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [completed, setCompleted] = useState<boolean>(todo.completed);

  const handleSubmitEdit = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    setLoading([todo.id]);
    const normalizeTitle = title.trim();

    if (!normalizeTitle) {
      showError(ErrorMessages.Empty);
      setLoading(null);

      return;
    }

    try {
      await editTodo(todo.id, { title });
    } catch (error) {
      showError(ErrorMessages.Edit);
      setFocusInput(true);
    } finally {
      setActiveEdit(false);
      setEditTodoId(null);
      setLoading(null);
    }
  };

  const handleToggleCompleted = async () => {
    setLoading([todo.id]);
    try {
      await editTodo(todo.id, { completed: !completed });
      setCompleted(prev => !prev);
    } catch (error) {
      showError(ErrorMessages.Edit);
    } finally {
      setLoading(null);
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
          'is-active': loading?.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
