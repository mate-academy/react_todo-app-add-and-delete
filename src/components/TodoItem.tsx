import React, {
  useContext, useState, useRef, useEffect,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodosContext } from '../context/TodosContext';
import { deleteTodo } from '../api/todos';

type Props = {
  todo: Todo;
  selectedTodo?: Todo | null;
  setSelectedTodo?: (todo: Todo | null) => void;
  hideError?: () => void;
  isProcessing?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  selectedTodo = null,
  setSelectedTodo = () => {},
  hideError = () => {},
  isProcessing = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [todos, setTodos, errorMsg, setErrorMsg] = useContext(TodosContext);
  // add setter
  const [tempTitle] = useState(todo.title);
  const [isSaving, setIsSaving] = useState(false);

  //! left for future tasks so lint doesn't complain
  if (selectedTodo?.id === -1) {
    setSelectedTodo(null);
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedTodo]);

  const handleTodoDeletion = () => {
    if (todo.id === 0) {
      return;
    }

    setIsSaving(true);

    if (errorMsg !== '') {
      hideError();
    }

    deleteTodo(todo.id)
      .then(() => {
        setTodos(todos.filter((t) => t.id !== todo.id));
      })
      .catch(() => {
        setErrorMsg('Unable to delete a todo');
      })
      .finally(() => setIsSaving(false));
  };

  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          id={`todo-${todo.id}`}
        />
      </label>

      {selectedTodo?.id !== todo.id ? (
        <>
          <span className="todo__title">{todo.title}</span>
          <button
            type="button"
            className="todo__remove"
            onClick={handleTodoDeletion}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            type="text"
            className="todo__title-field"
            value={tempTitle}
          />
        </form>
      )}

      <div
        className={classNames('modal overlay', {
          'is-active': isSaving || todo.id === 0 || isProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
