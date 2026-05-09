import React from 'react';
import classNames from 'classnames';
import { TodoContext } from './TodoContext';
import { USER_ID } from '../api/todos';
import * as postService from '../api/todos';

export const Header: React.FC = () => {
  const {
    todos,
    setTodos,
    shouldFocus,
    setShouldFocus,
    errorMessage,
    setErrorMessage,
  } = React.useContext(TodoContext)!;
  const [title, setTitle] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = title.trim();

    if (!trimmed) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    setLoading(true);
    if (inputRef.current) {
      inputRef.current.blur();
    }

    const tempTodo = {
      id: -Date.now(),
      title: trimmed,
      completed: false,
      userId: USER_ID,
      loading: true,
    };

    setTodos(current => [...current, tempTodo]);

    try {
      await postService.addTodo(trimmed);

      setTodos(current =>
        current.map(t => (t.id === tempTodo.id ? { ...t, loading: false } : t)),
      );
      setTitle('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setTodos(current => current.filter(t => t.id !== tempTodo.id));
      setTimeout(() => setErrorMessage(''), 3000);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } finally {
      setLoading(false);
    }
  };

  React.useLayoutEffect(() => {
    inputRef.current?.focus();
  }, []);

  React.useEffect(() => {
    if (shouldFocus) {
      inputRef.current?.focus();
      setShouldFocus(false);
    }
  }, [shouldFocus, setShouldFocus]);

  const handleToggleAll = () => {
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !todos.every(t => t.completed),
    }));

    setTodos(updatedTodos);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={addTodo}>
        <input
          ref={inputRef}
          autoFocus
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={loading}
          onChange={event => {
            setTitle(event.target.value);
            if (errorMessage) {
              setErrorMessage('');
            }
          }}
        />
      </form>
    </header>
  );
};
