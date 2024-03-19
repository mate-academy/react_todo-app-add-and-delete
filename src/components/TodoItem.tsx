import React, { useContext, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodosContext } from './TodosContext';
import classNames from 'classnames';
import { delTodo } from '../api/todos';

type Props = {
  todo: Todo;
  temp?: boolean;
};

export const TodoItem: React.FC<Props> = ({ todo, temp = false }) => {
  const { id, title, completed } = todo;
  const context = useContext(TodosContext);
  const { todos, setTodos, titleField } = context;
  const { setError, setErrorMessage, delTodoFromState } = context;
  const [newTitle, setNewTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const EditTitleField = useRef<HTMLInputElement | null>(null);

  const handlerCompleteTodo = () => {
    const updatedTodos = [...todos];
    const currentTodoIndex = updatedTodos.findIndex((elem: Todo) => {
      return elem.id === id;
    });

    if (currentTodoIndex !== -1) {
      const newCompleted = !updatedTodos[currentTodoIndex].completed;

      updatedTodos[currentTodoIndex] = {
        ...updatedTodos[currentTodoIndex],
        completed: newCompleted,
      };
      updatedTodos.splice(currentTodoIndex, 1, updatedTodos[currentTodoIndex]);

      setTodos(updatedTodos);
    }
  };

  const handlerDeleteTodo = () => {
    setIsDeleting(true);
    setErrorMessage('');

    delTodo(id)
      .then(() => {
        delTodoFromState(id);
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        if (titleField && titleField.current) {
          titleField.current.focus();
        }

        setIsDeleting(false);
      });
  };

  const handlerEditTodo = () => {
    setNewTitle(title);
    setIsEditing(true);
  };

  useEffect(() => {
    if (EditTitleField.current && isEditing) {
      EditTitleField.current.focus();
    }
  }, [isEditing]);

  const handlerEditTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handlerEndEditTodoOnBlur = () => {
    if (isEditing) {
      if (newTitle !== '') {
        const updatedTodos = [...todos];
        const currentTodoIndex = updatedTodos.findIndex(
          (elem: Todo) => elem.id === id,
        );

        if (currentTodoIndex !== -1) {
          updatedTodos[currentTodoIndex] = {
            ...updatedTodos[currentTodoIndex],
            title: newTitle.trim(),
          };
          updatedTodos.splice(
            currentTodoIndex,
            1,
            updatedTodos[currentTodoIndex],
          );

          setTodos(updatedTodos);
        }
      } else {
        setTodos(currentTodos => currentTodos.filter(elem => elem.id !== id));
      }
    }

    setIsEditing(false);
  };

  const handlerKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(title);
      setIsEditing(false);
    } else if (event.key === 'Enter') {
      handlerEndEditTodoOnBlur();
    }
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={cn('todo', {
          completed: completed,
          editing: isEditing,
        })}
        data-id={id}
        onDoubleClick={handlerEditTodo}
      >
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={handlerCompleteTodo}
          />
        </label>

        {isEditing ? (
          <form>
            <input
              ref={EditTitleField}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={handlerEditTitle}
              onBlur={handlerEndEditTodoOnBlur}
              onKeyUp={handlerKeyUp}
            />
          </form>
        ) : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handlerDeleteTodo}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': temp || isDeleting,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
