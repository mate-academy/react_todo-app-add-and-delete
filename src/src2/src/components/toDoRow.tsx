import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete?: () => Promise<void>;
  onRename?: (title: string) => Promise<void>;
  onToggle?: () => Promise<void>;
};

export const TodoRow: React.FC<Props> = ({
  todo,
  onDelete,
  onRename,
  onToggle,
}: Props) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(todo.title);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setTitle(todo.title);
        setEditing(false);
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleDoubleClickOnItem = () => {
    setEditing(true);
  };

  const handleToggleTodo = async () => {
    setLoading(true);
    if (onToggle) {
      await onToggle();
    }

    setLoading(false);
  };

  const handleDeleteTodo = async () => {
    setLoading(true);
    if (onDelete) {
      await onDelete();
    }

    setLoading(false);
  };

  const save = async () => {
    setEditing(false);
    setLoading(true);
    if (title) {
      if (onRename) {
        await onRename(title);
      }
    } else {
      if (onDelete) {
        await onDelete();
      }
    }

    setLoading(false);
  };

  // const toggleTodo = (todoToUpdate: Todo) => {
  //   return todoService
  //     .updateTodo({
  //       ...todoToUpdate,
  //       completed: !todoToUpdate.completed,
  //     })
  //     .then(updatedTodo => {
  //       setTodos(currentTodos =>
  //         currentTodos.map(todo =>
  //           todo.id === updatedTodo.id ? updatedTodo : todo,
  //         ),
  //       );
  //     })
  //     .catch(error => {
  //       showError('Unable to toggle a todo');
  //       throw error;
  //     });
  // };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      onDoubleClick={handleDoubleClickOnItem}
    >
      <label className="todo__status-label" aria-labelledby="todo-checkbox">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggleTodo}
        />
      </label>

      {editing ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            save();
          }}
        >
          <input
            type="text"
            data-cy="TodoTitleField"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            ref={inputRef}
            onChange={event => setTitle(event.target.value)}
            onBlur={() => {
              setEditing(false);
              setTitle(todo.title);
            }}
          />
        </form>
      ) : (
        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDeleteTodo}
      >
        x
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loading || todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
