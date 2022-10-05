import classNames from 'classnames';
import {
  KeyboardEvent, useContext, useEffect, useRef,
} from 'react';
import { deleteTodo, updateTodo } from '../../../api/todos';
import { TypeChange } from '../../../types/TypeChange';
import { Todo } from '../../../types/Todo';
import { TodoContext } from '../../../context/TodoContext';

type Props = {
  todo: Todo,
};

export const TodoRender: React.FC<Props> = ({
  todo,
}) => {
  const {
    handleStatusChange,
    selectedTodoId,
    setSelectedTodoId,
    setInputValue,
    inputValue,
    handleChangeTitle,
    setLoadError,
    setErrorMessage,
    allCompletedLoader,
    todoIdLoader,
    setTodoIdLoader,
    toggleLoader,
  } = useContext(TodoContext);

  const {
    title, completed, id,
  } = todo;
  const newTodoField = useRef<HTMLInputElement>(null);

  const removeFromServer = async (data: Todo) => {
    try {
      setTodoIdLoader(data.id);
      await deleteTodo(data.id);
      handleStatusChange(data, TypeChange.delete);
    } catch (_) {
      setLoadError(true);
      setErrorMessage('Unable to delete todo from the server');
    } finally {
      setTodoIdLoader(null);
      setSelectedTodoId(-1);
    }
  };

  const handleRemoveTodo = (data: Todo) => {
    removeFromServer(data);
  };

  const changeCompleteOnServer = async () => {
    try {
      setTodoIdLoader(id);
      const todoWithChangedComplete = { ...todo };

      todoWithChangedComplete.completed = !completed;

      await updateTodo(id, todoWithChangedComplete);
      handleStatusChange(todo, TypeChange.checkbox);
    } catch (_) {
      setLoadError(true);
      setErrorMessage('Unable to change complete status');
    } finally {
      setTodoIdLoader(null);
    }
  };

  const handleCompleteChange = () => {
    changeCompleteOnServer();
  };

  const handleRenameTitle = async () => {
    if (title === inputValue) {
      setSelectedTodoId(-1);

      return;
    }

    if (!inputValue.trim()) {
      removeFromServer(todo);

      return;
    }

    try {
      setTodoIdLoader(todo.id);
      const newTitle = { ...todo };

      newTitle.title = inputValue;
      await updateTodo(id, newTitle);
      handleStatusChange(todo, TypeChange.title);
    } catch (_) {
      setLoadError(true);
      setErrorMessage('Unable to rename title. Server didn\'t response');
    } finally {
      setTodoIdLoader(null);
      setSelectedTodoId(-1);
    }

    if (newTodoField.current) {
      newTodoField.current.blur();
    }
  };

  const handleSubmitOnKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && newTodoField.current) {
      newTodoField.current.blur();
    }

    if (event.key === 'Escape') {
      setSelectedTodoId(-1);
    }
  };

  const handleDoubleClick = () => {
    setSelectedTodoId(todo.id);
    setInputValue(title);
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [selectedTodoId]);

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
      )}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={handleCompleteChange}
        />
      </label>

      {(selectedTodoId !== id && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => handleDoubleClick()}
        >
          {title}
        </span>
      ))}
      {selectedTodoId === id && (
        <input
          value={inputValue}
          className="input is-large is-primary"
          onBlur={() => handleRenameTitle()}
          onChange={handleChangeTitle}
          onKeyUp={handleSubmitOnKey}
          ref={newTodoField}
        />
      )}
      {selectedTodoId !== id && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={() => handleRemoveTodo(todo)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': todo.id === 0 || todo.id === todoIdLoader
            || (allCompletedLoader && todo.completed) || toggleLoader,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
