import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Actions, DispatchContext, Keys } from '../Store';
import { deleteData } from '../../api/todos';

interface Props {
  todo: Todo,
  loaderActive: boolean,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  loaderActive,
}) => {
  const dispatch = useContext(DispatchContext);
  const { id, title, completed } = todo;
  const [currentTitle, setCurrentTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(loaderActive);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleInputToogle = () => {
    dispatch({
      type: Actions.mark,
      todo,
    });
  };

  const deleteTodo = () => {
    setIsUpdating(true);
    deleteData(id)
      .then(() => {
        dispatch({
          type: Actions.destroy,
          todo,
        });
      })
      .catch(() => {
        setIsUpdating(false);
        dispatch({ type: Actions.setDeletingError });
      });
  };

  const validateTitle = (currentTodo: Todo, targetTitle: string) => {
    if (!targetTitle.trim()) {
      deleteTodo();
    } else {
      dispatch({
        type: Actions.edit,
        todo: {
          ...currentTodo,
          title: targetTitle,
        },
      });
    }

    setIsEditing(false);
  };

  const handleTodoEditKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === Keys.Escape) {
      setIsEditing(false);
    } else if (event.key === Keys.Enter) {
      validateTitle(todo, currentTitle);
    }
  };

  const handleEditingInputBlur = () => {
    validateTitle(todo, currentTitle);
  };

  const handleTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTitle(event.target.value);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      onDoubleClick={handleDoubleClick}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id="toggle-view"
          onChange={handleInputToogle}
          checked={completed}
        />
      </label>
      {!isEditing ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            aria-label="Save"
            onClick={deleteTodo}
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            placeholder="Empty todo will be deleted"
            type="text"
            className="todo__title-field"
            value={currentTitle}
            onChange={handleTodoChange}
            onKeyUp={handleTodoEditKey}
            onBlur={handleEditingInputBlur}
          />
        </form>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay ', {
          'is-active': isUpdating || loaderActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
