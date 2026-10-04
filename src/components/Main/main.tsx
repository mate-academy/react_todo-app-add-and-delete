/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  visibilitedTodos: Todo[];
  handleCheck: (id: number, status: boolean) => void;
  deleteTodo: (idL: number) => void;
  loadingTodo: {
    isLoading: boolean;
    id: number[];
  };
  isDeletingCompleted: boolean;
};

export const Main = ({
  visibilitedTodos,
  handleCheck,
  deleteTodo,
  loadingTodo,
  isDeletingCompleted,
}: Props) => {
  const [isEditId, setIsEditId] = useState(0);
  const [inputEdit, setInputEdit] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const finishEditing = () => {
    setIsEditId(0);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        finishEditing();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isEditId !== 0) {
      inputRef.current?.focus();
    }
  }, [isEditId]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibilitedTodos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames('todo', {
            completed: todo.completed,
          })}
          key={todo.id}
        >
          <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
            <input
              id={`todo-${todo.id}`}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => handleCheck(todo.id, todo.completed)}
            />
          </label>

          {isEditId !== todo.id && (
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setIsEditId(todo.id);
                setInputEdit(todo.title);
              }}
              onMouseDown={event => {
                if (event.detail > 1) {
                  event.preventDefault();
                }
              }}
            >
              {todo.title}
            </span>
          )}

          {isEditId === todo.id && (
            <form
              onSubmit={event => {
                event.preventDefault();
                finishEditing();
              }}
            >
              <input
                ref={inputRef}
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                value={inputEdit}
                onChange={event => setInputEdit(event.target.value)}
              />
            </form>
          )}

          {isEditId !== todo.id && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>
          )}
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active':
                loadingTodo.id.includes(todo.id) ||
                (isDeletingCompleted && todo.completed),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
