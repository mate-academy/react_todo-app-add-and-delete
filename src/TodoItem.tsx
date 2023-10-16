import {
  Dispatch,
  SetStateAction,
  useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { deleteTodos } from './api/todos';

type Props = {
  todo: Todo,
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setErrorMessage: Dispatch<SetStateAction<string>>,
};

export const TodoItem: React.FC<Props> = ({
  todo, todos, setTodos, setErrorMessage,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [todoValue, setTodoValue] = useState(todo.title);
  const [shouldHandleBlur, setShouldHandleBlur] = useState(true);

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

  const removeTodo = (id: number) => {
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
  };

  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  const handleDoubleClick = () => {
    setShouldHandleBlur(true);
    setIsEdit(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.trim();

    setTodoValue(newValue === '' ? '' : event.target.value);
  };

  function updateTodo() {
    const newTodoTitle = todoValue;

    const updatedTodos = todos.map((prevTodo) => {
      if (prevTodo.id === todo.id) {
        return { ...prevTodo, title: newTodoTitle };
      }

      return prevTodo;
    });

    setTodos(updatedTodos);
    setIsEdit(false);
  }

  const handleLabelKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!todoValue.length && event.key === 'Enter') {
      removeTodo(todo.id);
    }

    if (todoValue.length && event.key === 'Enter') {
      event.preventDefault();
      updateTodo();
    }
  };

  const handleLabelKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTodoValue(todo.title);
      setIsEdit(false);
      setShouldHandleBlur(false);
    }
  };

  const handleLabelBlur = () => {
    if (shouldHandleBlur) {
      if (!todoValue.length) {
        removeTodo(todo.id);
      } else {
        updateTodo();
      }
    }
  };

  return (
    /* This todo is in loadind state <div data-cy="Todo" className="todo"> */
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

      {!isEdit && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
        </span>
      )}

      {!isEdit && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => removeTodo(todo.id)}
          aria-label="Delete"
        >
          ×
        </button>
      )}

      {isEdit && (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoValue}
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
