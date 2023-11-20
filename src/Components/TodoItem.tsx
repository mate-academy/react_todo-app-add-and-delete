/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

interface T {
  myTodo: Todo,
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  todos: Todo[],
  isLoading: boolean,
  setIsError: Dispatch<SetStateAction<boolean>>,
  tempTodo: Todo | null,
}

export const TodoItem: React.FC<T> = ({
  myTodo,
  setTodos,
  todos,
  isLoading,
  setIsError,
  tempTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(myTodo.title);
  const [isThisLoading, setIsThisLoading] = useState(false);

  const DELETE = 'delete';
  const CHANGE = 'change';
  const CHANGE_NAME = 'changeName';

  const onChange = async (
    todoEdit: Todo,
    value: string,
    string = 'default',
  ) => {
    let updatedTodos;

    switch (value) {
      case 'delete':
        try {
          setIsThisLoading(true);
          await client.delete(`/todos/${todoEdit.id}`);
        } catch (error) {
          setIsError(true);
        } finally {
          setTimeout(() => {
            setIsThisLoading(false);
            setTodos(todos.filter(todo => todo.id !== todoEdit.id));
          }, 1000);
        }

        break;
      case 'change':
        updatedTodos = todos.map(todo => {
          if (todo.id === todoEdit.id) {
            return { ...todo, completed: !todo.completed };
          }

          return todo;
        });

        setTodos(updatedTodos);
        break;

      case 'changeName':
        updatedTodos = todos.map(todo => {
          if (todo.id === todoEdit.id) {
            return { ...todo, title: string };
          }

          return todo;
        });

        setTodos(updatedTodos);
        break;
      default:
    }
  };

  const handleBlur = (todoEdit: Todo) => {
    if (!editedText.trim()) {
      onChange(todoEdit, DELETE);
    } else {
      onChange(todoEdit, CHANGE_NAME, editedText);
    }

    setIsEditing(false);
  };

  const handleKeyPress = (todoEdit: Todo, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur(todoEdit);
    }

    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <li
      key={myTodo.id}
      className={classNames({
        completed: myTodo.completed,
        editing: isEditing,
      })}
    >
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: myTodo.completed })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            onChange={() => onChange(myTodo, CHANGE)}
            checked={myTodo.completed}
          />
        </label>
        {isEditing ? (
          <form>
            <input
              type="text"
              data-cy="TodoTitleField"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedText}
              onChange={(event) => setEditedText(event.target.value)}
              onBlur={() => handleBlur(myTodo)}
              onKeyDown={(e) => handleKeyPress(myTodo, e)}
            />
          </form>
        ) : (
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {myTodo.title}
          </span>
        )}
        {!isEditing && (
          <button
            className="todo__remove"
            data-cy="TodoDelete"
            type="button"
            onClick={() => onChange(myTodo, DELETE)}
          >
            x
          </button>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay',
            {
              'is-active':
                isLoading || isThisLoading || tempTodo?.id === myTodo.id,
            })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </li>
  );
};
