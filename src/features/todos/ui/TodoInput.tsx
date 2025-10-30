import { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useNotification } from '../contexts/NotificationContext';
import { TodosContext } from '../contexts/TodoContext';
import { USER_ID } from '../api/todos';
import { useFocus } from '../contexts/FocusContext';
import { ErrorType } from '../model/types';

export const TodoInput: React.FC = () => {
  const { state, handleAddTodo, handleToggleAll } = useContext(TodosContext);
  const { isError, todos } = state;
  const { showNotification, hideNotification } = useNotification();
  const { setFocusRef } = useFocus();

  const [newTodo, setNewTodo] = useState('');
  const [isNewTodoLoading, setIsNewTodoLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFocusRef(inputRef);
  }, [setFocusRef]);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, []);

  const placeholder = isError
    ? 'Something went wrong... we are sorry!'
    : 'What needs to be done?';

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== 'Enter') {
      return;
    }

    const title = newTodo.trim();

    if (!title) {
      showNotification(ErrorType.EMPTY_TITLE);
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }

    hideNotification();
    setIsNewTodoLoading(true);

    try {
      await handleAddTodo({
        title,
        completed: false,
        userId: USER_ID,
      });

      setNewTodo('');
      setTimeout(() => inputRef.current?.focus(), 0);
    } catch {
      showNotification(ErrorType.ADD_TODO);
      setIsNewTodoLoading(false);
      if (inputRef.current) {
        inputRef.current.disabled = false;
      }
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    } finally {
      setIsNewTodoLoading(false);
    }
  };

  const toggleAllClass = classNames('todoapp__toggle-all', {
    active: todos.length > 0 && todos.every(todo => todo.completed),
  });

  return (
    <header className="todoapp__header">
      <form onSubmit={e => e.preventDefault()}>
        <div className="todoapp__input-wrapper">
          {todos.length > 0 && (
            <button
              type="button"
              className={toggleAllClass}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <input
            ref={inputRef}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder={placeholder}
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isNewTodoLoading}
          />
        </div>
      </form>
    </header>
  );
};
