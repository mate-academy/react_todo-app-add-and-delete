import { FC, useState, useEffect } from 'react';
import { Todo } from '../../types/Todo/Todo';
import classNames from 'classnames';
import { useTodoContext } from '../../context/TodoContext';
import { useTodoActions } from '../../utils/hooks/useTodoActions';
import { ErrorMessages } from '../../types/ErrorMessages/ErrorMessages';

type Props = { todo: Todo };

export const TodoItem: FC<Props> = ({
  todo: { id, title: todoTitle, completed: todoCompleted },
}) => {
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
  const [title, setTitle] = useState(todoTitle);
  const [completed, setCompleted] = useState<boolean>(todoCompleted);

  const handleSubmitEdit = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    setLoadingTodoIds([id]);
    const normalizeTitle = title.trim();

    if (!normalizeTitle) {
      showError(ErrorMessages.Empty);
      setLoadingTodoIds(null);

      return;
    }

    try {
      await editTodo(id, { title });
    } catch (error) {
      setTitle(title);
      setLockedFocus(true);
    } finally {
      setEditTodoId(null);
      setLoadingTodoIds(null);
    }
  };

  const handleToggleCompleted = async () => {
    setLoadingTodoIds([id]);
    try {
      await editTodo(id, { completed: !completed });
      setCompleted(prev => !prev);
    } catch (error) {
      showError(ErrorMessages.Edit);
    } finally {
      setLoadingTodoIds(null);
    }
  };

  const handleDoubleClick = () => {
    if (!todoCompleted) {
      setEditTodoId(id);
      setActiveEdit(true);
      setLockedFocus(true);
    }
  };

  useEffect(() => {
    if (activeEdit && editTodoId === id) {
      setTitle(todoTitle);
    }
  }, [editTodoId, activeEdit, todoTitle, id]);

  useEffect(() => {
    setCompleted(todoCompleted);
  }, [todoCompleted]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', 'item-enter-done', {
        completed: todoCompleted,
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

      {activeEdit && editTodoId === id ? (
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
            onDoubleClick={handleDoubleClick}
          >
            {todoTitle}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo([id])}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodoIds?.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
