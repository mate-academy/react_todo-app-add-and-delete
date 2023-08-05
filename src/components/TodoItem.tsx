import classNames from 'classnames';
import { useState, useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

interface Item {
  todo: Todo,
  loaderId: number[],
  removeTodo: (todoId: number) => Promise<unknown>,
  updateTodo: (todoId: number) => Promise<unknown>,
  updateTodoTitle: (todoId: number) => Promise<unknown>,
  switchTodoTitle: (newTitle: string) => void,
  newTodoTitle: string,
}

export const TodoItem: React.FC<Item> = ({
  todo,
  loaderId,
  removeTodo,
  updateTodo,
  updateTodoTitle,
  switchTodoTitle,
  newTodoTitle,
}) => {
  const [loadingTodo, setLoadingTodo] = useState(false);
  const [editing, setEditing] = useState(false);

  const selectedField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && selectedField.current) {
      selectedField.current.focus();
    }
  }, [editing]);

  function enterEdit() {
    switchTodoTitle(todo.title);
    setEditing(true);
  }

  function clearEdit() {
    switchTodoTitle('');
    setEditing(false);
  }

  const handleToggle = () => {
    setLoadingTodo(true);
    updateTodo(todo.id)
      .finally(() => setLoadingTodo(false));
  };

  const handleRemove = () => {
    setLoadingTodo(true);
    removeTodo(todo.id)
      .finally(() => setLoadingTodo(false));
  };

  const handleTitleChange = () => {
    const isTitleChanged = newTodoTitle !== todo.title;
    const isTitleEmpty = !newTodoTitle;

    if (!isTitleChanged || isTitleEmpty) {
      clearEdit();
    }

    if (isTitleEmpty) {
      handleRemove();
    }

    if (isTitleChanged && !isTitleEmpty) {
      setLoadingTodo(true);
      updateTodoTitle(todo.id)
        .finally(() => setLoadingTodo(false));

      clearEdit();
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleTitleChange();
  };

  const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    switchTodoTitle(event.target.value);
  };

  const onLostFocus = () => {
    handleTitleChange();
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        handleTitleChange();
        break;

      case 'Escape':
        clearEdit();
        break;

      default:
    }
  };

  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
      onDoubleClick={enterEdit}
    >

      <label className="todo__status-label">
        <input
          disabled={loadingTodo}
          checked={todo.completed}
          type="checkbox"
          className="todo__status"
          onChange={handleToggle}
        />
      </label>

      {!editing && (
        <>
          <span className="todo__title">{todo.title}</span>
          <button
            type="button"
            disabled={loadingTodo}
            className="todo__remove"
            onClick={handleRemove}
          >
            ×
          </button>
        </>
      )}

      {(editing) && (
        <form
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            disabled={loadingTodo}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={selectedField}
            value={newTodoTitle}
            onChange={changeTitle}
            onBlur={onLostFocus}
            onKeyDown={handleKeyPress}
            onKeyUp={handleKeyPress}
          />
        </form>
      )}

      <div
        className={`modal overlay ${loadingTodo || loaderId.includes(todo.id)
          ? 'is-active' : ''}`}

      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>

  );
};
