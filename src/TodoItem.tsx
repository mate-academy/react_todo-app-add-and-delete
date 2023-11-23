import classNames from 'classnames';
import {
  Dispatch, SetStateAction, useEffect, useRef, useState,
} from 'react';
import { Todo } from './types/Todo';
import { deleteTodos } from './api/todos';

type Props = {
  todo: Todo,
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setErrorMessage: Dispatch<SetStateAction<string>>
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  setTodos,
  setErrorMessage,
}) => {
  const [value, setValue] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const [isHandleBlur, setIsHandleBlur] = useState(true);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleCheckbox = () => {
    const setTodosArgs = (prevTodos: Todo[]) => {
      return prevTodos.map((prevTodo) => {
        if (prevTodo.id === todo.id) {
          return { ...prevTodo, completed: !prevTodo.completed };
        }

        return prevTodo;
      });
    };

    setTodos(setTodosArgs(todos));
  };

  function deleteTodo(id: number) {
    deleteTodos(id)
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });

    const index = todos.findIndex(elem => elem.id === id);

    if (index !== -1) {
      const newTodos = [...todos];

      newTodos.splice(index, 1);
      setTodos(newTodos);
    }
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsHandleBlur(true);
    setIsEditing(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.trim();

    if (newValue) {
      setValue(newValue);
    }
  };

  function updateTodo() {
    const todoTitle = value;

    const updatedTodos = todos.map(currentTodo => {
      if (currentTodo.id === todo.id) {
        return { ...currentTodo, title: todoTitle };
      }

      return currentTodo;
    });

    setTodos(updatedTodos);
    setIsEditing(false);
  }

  const handleLabelKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!value.length && event.key === 'Enter') {
      deleteTodo(todo.id);
    }

    if (value.length && event.key === 'Enter') {
      event.preventDefault();
      updateTodo();
    }
  };

  const handleLabelKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setValue(todo.title);
      setIsEditing(false);
      setIsHandleBlur(false);
    }
  };

  const handleLabelBlur = () => {
    if (isHandleBlur) {
      if (!value.length) {
        deleteTodo(todo.id);
      } else {
        updateTodo();
      }
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCheckbox}
        />
      </label>

      {!isEditing && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
            aria-label="Delete"
          >
            ×
          </button>
        </>
      )}

      {isEditing && (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={value}
            onChange={handleLabelChange}
            onKeyDown={handleLabelKeyDown}
            onKeyUp={handleLabelKeyUp}
            onBlur={handleLabelBlur}
            ref={inputRef}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className="modal overlay"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
