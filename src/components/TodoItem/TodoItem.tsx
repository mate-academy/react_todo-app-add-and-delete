/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import {
  useContext, useState, useRef, useEffect,
} from 'react';
import { Todo } from '../../types/Todo';
import { AppContext } from '../TodoContext/TodoContext';
import * as todoService from '../../api/todos';

type Props = {
  todo: Todo;
};

const ENTER = 'Enter';
const ESC = 'Escape';

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { todos, setTodos } = useContext(AppContext);
  const { id, title, completed } = todo;

  const [editTitle, setEditTitle] = useState(title);
  const [isEdit, setIsEdit] = useState(false);
  const editNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editNameRef.current) {
      editNameRef.current.focus();
    }
  }, [isEdit]);

  const handleToggleViewChange = () => {
    setTodos(
      todos.map((todoItem) => (todoItem.id === id
        ? { ...todoItem, completed: !completed } : todoItem)),
    );
  };

  const handleTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditTitle(event.target.value);
  };

  const saveTitle = (value: string) => {
    if (value.trim()) {
      setTodos(
        todos.map((todoItem) => (todoItem.id === id
          ? { ...todoItem, title: value.trim() } : todoItem)),
      );

      setEditTitle(value.trim());
    } else {
      setTodos(todos.filter((todoItem) => todoItem.id !== id));
    }

    setIsEdit(false);
  };

  const handleTodoTitleBlur = () => {
    if (editNameRef.current) {
      saveTitle(editNameRef.current.value);
    }
  };

  const handleTodoTitleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === ENTER) {
      if (editNameRef.current) {
        saveTitle(editNameRef.current.value);
      }
    }

    if (event.key === ESC) {
      setEditTitle(title);
      setIsEdit(false);
    }
  };

  const handleDeleteClick = () => {
    todoService.deleteTodo(id);
    setTodos(todos.filter((todoItem) => todoItem.id !== id));
  };

  return (
    <div
      className={cn('todo', {
        completed: !isEdit && completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={handleToggleViewChange}
          checked={completed}
        />
      </label>

      {!isEdit ? (
        <span
          onDoubleClick={() => setIsEdit(true)}
          className="todo__title"
          data-cy="TodoTitle"
        >
          {title}
        </span>
      ) : (
        <>
          <form>
            <input
              type="text"
              data-cy="TodoTitleField"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={editNameRef}
              onChange={handleTodoTitleChange}
              onKeyUp={handleTodoTitleKeyUp}
              onBlur={handleTodoTitleBlur}
              value={editTitle}
            />
          </form>

          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        aria-label="deleteTodo"
        onClick={handleDeleteClick}
      >
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
