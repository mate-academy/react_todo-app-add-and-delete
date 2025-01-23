import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { addTodo } from '../../api/todos';
import classNames from 'classnames';

interface HeaderProps {
  visibleTodos: Todo[];
  inputText: string;
  error: boolean;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setAllTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  allTodos: Todo[];
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
}

export const Header: React.FC<HeaderProps> = ({
  visibleTodos,
  inputText,
  error,
  setInputText,
  setError,
  setErrorMessage,
  setAllTodos,
  allTodos,
  loading,
  setLoading,
  setTempTodo,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(false);
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [error, setError, setErrorMessage]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  return (
    <header className="todoapp__header">
      {visibleTodos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form
        onSubmit={event => {
          addTodo(
            inputText,
            setError,
            setErrorMessage,
            setAllTodos,
            setInputText,
            allTodos,
            setLoading,
            setTempTodo,
            event,
          );
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputText}
          onChange={event => setInputText(event.target.value)}
          disabled={loading}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
