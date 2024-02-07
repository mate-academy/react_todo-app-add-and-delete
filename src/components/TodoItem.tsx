import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';
import { Todo } from '../types/Todo';

import {
  DeletingTodosIdsContext,
  ErrorContext,
  TodosContext,
} from '../providers/TodosProvider';
import { FocusContext } from '../providers/FocusProvider';
import { deleteTodoItem } from '../utils/deleteTodoItem';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const { setTodos } = useContext(TodosContext);
  const { setErrorMessage } = useContext(ErrorContext);
  const {
    deletingTodosIds,
    setDeletingTodosIds,
  } = useContext(DeletingTodosIdsContext);
  const { setFocus } = useContext(FocusContext);

  const todoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && todoInputRef.current) {
      todoInputRef.current.focus();
    }
  }, [isEditing]);

  // need to normalize and update the title on server
  const handleUpdateTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewTitle(e.target.value);
    }, [],
  );

  const handleDeleteTodo = useCallback(() => {
    setDeletingTodosIds([...deletingTodosIds, todo.id]);
    deleteTodoItem({
      todoId: todo.id,
      setTodos,
      setErrorMessage,
      setDeletingTodosIds,
      setFocus,
    });
  }, [
    todo.id,
    deletingTodosIds,
    setTodos,
    setErrorMessage,
    setDeletingTodosIds,
    setFocus,
  ]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      {/* This form is shown instead of the title and remove button */}
      {isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsEditing(false);
          }}
        >
          <input
            ref={todoInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleUpdateTitle}
            onBlur={() => setIsEditing(false)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {/* Change title 'Todo is being saved now' if update the title */}
            {todo.title}
          </span>

          {/*  Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */}
      {/* add class 'is active while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todo.id === 0 || deletingTodosIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
