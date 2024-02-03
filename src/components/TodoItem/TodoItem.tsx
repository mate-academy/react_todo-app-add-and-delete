/* eslint-disable react-hooks/exhaustive-deps */
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
    isCompletedAll,
    setIsCompletedAll,
    deleteTodo,
    errorMessage,
    pressClearAll,
  } = useContext(TodosContext);

  const [isCompleted, setIsCompleted] = useState(todo.completed);
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
  }, [todos]);

  const handleCheckbox = () => {
    setIsCompleted(!isCompleted);
    const updatedTodo = { ...todo, completed: !isCompleted };

    updateTodo(updatedTodo);
  };

  const handleDeleteTodo = () => {
    setIsDeleting(true);
    deleteTodo(todo.id);
  };

  useEffect(() => {
    if (errorMessage) {
      setIsDeleting(false);
    }
  }, [errorMessage]);

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

  useEffect(() => {
    const completedAll = todos.every(completedTodo => completedTodo.completed);

    if (completedAll && todos.length !== 0) {
      setIsCompletedAll(true);
    }

    if (!completedAll) {
      setIsCompletedAll(null);
    }
  }, [isCompleted, todos]);

  useEffect(() => {
    if (isCompletedAll) {
      setIsCompleted(isCompletedAll);

      const updatedTodos = todos.map(upTodo => (
        { ...upTodo, completed: isCompletedAll }
      ));

      setTodos(updatedTodos);
    }

    if (isCompletedAll === false) {
      setIsCompleted(isCompletedAll);

      const updatedTodos = todos.map(upTodo => (
        { ...upTodo, completed: isCompletedAll }
      ));

      setTodos(updatedTodos);
    }
  }, [isCompletedAll]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: isCompleted })}
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
