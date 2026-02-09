import { useState } from 'react';
import { postTodos, USER_ID } from '../api/todos';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type TodoInputProps = {
  todos: Todo[];
  completedTodos: Todo[];
  handleErrorMessage: (errorMessage: string) => void;
  loadingTodos: number | null;
  setLoadingTodos: (id: number | null) => void;
  handleTodoAdded: (todo: Todo) => void;
  handleCheckAllTodos: () => void;
  setTempTodo: (temp: Todo | null) => void;
  submmitInputRef: React.RefObject<HTMLInputElement>;
};

export function TodoInput({
  todos,
  completedTodos,
  handleErrorMessage,
  loadingTodos,
  setLoadingTodos,
  handleTodoAdded,
  handleCheckAllTodos,
  setTempTodo,
  submmitInputRef,
}: TodoInputProps) {
  const [query, setQuery] = useState<string>('');

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loadingTodos) {
      return;
    }

    if (!query || query.trim() === '') {
      handleErrorMessage('Title should not be empty');

      return;
    }

    if (query) {
      setLoadingTodos(0);

      const newTodo = {
        userId: USER_ID,
        title: query.trim(),
        completed: false,
      };

      setTempTodo({ ...newTodo, id: 0 });

      try {
        const todo = await postTodos(newTodo);

        handleTodoAdded(todo);
        setTempTodo(null);
        setQuery('');
      } catch (error) {
        handleErrorMessage('Unable to add a todo');
        setTempTodo(null);
      } finally {
        setLoadingTodos(null);
        // Defer focus to ensure it happens after DOM updates
        setTimeout(() => {
          submmitInputRef.current?.focus();
        }, 0);
      }
    }
  };

  const handleFormChanges = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.length === completedTodos.length,
          })}
          onClick={handleCheckAllTodos}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          disabled={loadingTodos !== null}
          autoFocus
          onChange={event => handleFormChanges(event)}
          ref={submmitInputRef}
        />
      </form>
    </header>
  );
}
