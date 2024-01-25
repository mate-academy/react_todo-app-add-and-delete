import {
  ChangeEvent,
  useContext,
  useEffect,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { DispatchContext, StateContext } from '../../State/State';
import { deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  setIsEditing?: (v: boolean) => void
  isLoading?: boolean,
  setIsLoading?: (v: boolean) => void
  currentTitle?: string,
  setCurrentTitle?: (v: string) => void
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setIsEditing,
  isLoading,
  setIsLoading,
  currentTitle,
  setCurrentTitle,
}) => {
  const { title, completed, id } = todo;

  const { clearAll, isEscapeKeyup } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    if (clearAll && completed && setIsLoading) {
      setIsLoading(true);
    }
  }, [clearAll, completed, dispatch, setIsLoading]);

  useEffect(() => {
    if (isEscapeKeyup && setCurrentTitle && setIsEditing) {
      setIsEditing(false);
      setCurrentTitle(title);
      dispatch({ type: 'setEscape', payload: false });
    }
  }, [isEscapeKeyup, dispatch, title, setIsEditing, setCurrentTitle]);

  function toggleTodoStatus(event: ChangeEvent<HTMLInputElement>) {
    if (!setIsLoading) {
      return;
    }

    const updatedTodo = {
      completed: event.target.checked,
      id,
    };

    setIsLoading(true);

    updateTodo(updatedTodo)
      .then(() => dispatch({ type: 'updatedAt' }))
      .catch(() => dispatch(
        { type: 'setError', payload: 'Unable to update a todo' },
      ))
      .finally(() => setIsLoading(false));
  }

  function handleDeleteTodo() {
    if (!setIsLoading) {
      return;
    }

    setIsLoading(true);

    deleteTodo(`/todos/${id}`)
      .then(() => dispatch({ type: 'deleteTodo', payload: id }))
      .catch(() => {
        dispatch(
          { type: 'setError', payload: 'Unable to delete a todo' },
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleDoubleClick() {
    if (!setIsEditing) {
      return;
    }

    setIsEditing(true);
  }

  return (
    <div
      data-cy="Todo"
      className={cn('todo item-enter-done', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={toggleTodoStatus}
          checked={completed}
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
        onDoubleClick={handleDoubleClick}
      >
        {currentTitle || title}
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

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading || (!currentTitle && !isLoading),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
