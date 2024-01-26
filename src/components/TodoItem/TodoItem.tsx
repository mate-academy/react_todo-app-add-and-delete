import {
  ChangeEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { DispatchContext, StateContext } from '../../State/State';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { title, id, completed } = todo;

  const [currentTitle, setCurrentTitle] = useState(title);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useContext(DispatchContext);
  const { todosForUpdateIds, tempTodo } = useContext(StateContext);

  const edit = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (edit.current) {
      edit.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (todosForUpdateIds?.includes(id)) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [todosForUpdateIds, id]);

  useEffect(() => {
    if (tempTodo && id === 0) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [tempTodo, id]);

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

  function editTodo(event: React.FormEvent) {
    event.preventDefault();
    setCurrentTitle(currentTitle.trim());

    if (title === currentTitle) {
      setIsEditing(false);

      return;
    }

    setIsLoading(true);

    if (currentTitle.length) {
      updateTodo({ title: currentTitle, id })
        .then(updatedTodo => {
          setIsEditing(false);
          dispatch({ type: 'updateTodo', payload: updatedTodo });
          setIsEditing(false);
        })

        .catch(() => dispatch(
          { type: 'setError', payload: 'Unable to update a todo' },
        ))

        .finally(() => {
          setIsLoading(false);
        });

      return;
    }

    handleDeleteTodo();
  }

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
      .then(res => dispatch(
        { type: 'updateTodo', payload: res },
      ))
      .catch(() => dispatch(
        { type: 'setError', payload: 'Unable to update a todo' },
      ))
      .finally(() => setIsLoading(false));
  }

  function handleDoubleClick() {
    if (!setIsEditing) {
      return;
    }

    setIsEditing(true);
  }

  function handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setCurrentTitle(title);
      setIsEditing(false);
    }
  }

  return (
    <>
      {!isEditing
        ? (
          (
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
                  'is-active': isLoading,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )
        )
        : (
          <>
            {/* This todo is being edited */}
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              {/* This form is shown instead of the title and remove button */}
              <form onSubmit={editTodo}>
                <input
                  ref={edit}
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={currentTitle}
                  onChange={event => setCurrentTitle(event.target.value)}
                  onBlur={editTodo}
                  onKeyUp={handleKeyUp}
                />
              </form>

              <div
                data-cy="TodoLoader"
                className={cn('modal overlay', {
                  'is-active': isLoading,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </>
        )}
    </>
  );
};
