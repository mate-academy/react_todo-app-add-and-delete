import React, {
  useCallback,
  useContext, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../Store/Store';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = React.memo(({ todo }) => {
  const {
    todos,
    setTodos,
    loading,
    setLoading,
    deleteTodo,
    errorMessage,
    setErrorMessage,
    pressClearAll,
  } = useContext(TodosContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const todoField = useRef<HTMLInputElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(event.target.value);
  };

  const updateTodo = useCallback((updatedTodo: Todo) => {
    const updatedTodos = todos.map(upTodo => (
      upTodo.id === updatedTodo.id
        ? { ...updatedTodo }
        : upTodo
    ));

    setTodos(updatedTodos);
  }, [setTodos, todos]);

  const handleCheckbox = () => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    updateTodo(updatedTodo);
  };

  const handleDeleteTodo = async () => {
    try {
      setIsDeleting(true);
      const updatedTodos = todos.filter(upTodo => upTodo.id !== todo.id);

      await deleteTodo(todo.id);
      setTodos(updatedTodos);
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setLoading(false);
      setIsDeleting(false);
    }
  };

  const applyEditing = () => {
    if (editTitle.length === 0) {
      handleDeleteTodo();

      return;
    }

    if (editTitle !== todo.title) {
      const updatedTodo = { ...todo, title: editTitle };

      updateTodo(updatedTodo);
    }

    setIsEditing(false);
  };

  const handleEdit = (event: React.FormEvent) => {
    event.preventDefault();
    applyEditing();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if ((isEditing || errorMessage) && todoField.current) {
      todoField.current.focus();
    }
  }, [isEditing, errorMessage]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={handleCheckbox}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={handleEdit}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              ref={todoField}
              value={editTitle}
              onChange={handleEditTitle}
              onBlur={applyEditing}
              onKeyDown={handleKeyDown}
            />
          </form>
        )
        : (
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
        )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDeleteTodo}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay',
          {
            'is-active': (loading && isDeleting)
              || (pressClearAll && todo.completed),
          })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
