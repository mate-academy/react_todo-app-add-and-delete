import React, { useEffect, useRef } from 'react';
import { useTodos } from '../../utils/TodoContext';
import { USER_ID } from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessage';

export const TodoHeader: React.FC = () => {
  const {
    setTodos,
    setError,
    isLoading,
    query,
    setQuery,
    setTempTodo,
    addTodo,
  } = useTodos();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const isQueryValid = !!query.trim();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isQueryValid) {
      setError(ErrorMessage.TITLE_IS_EMPTY);

      return;
    }

    setTempTodo({
      id: 0,
      title: query.trim(),
      completed: false,
      userId: USER_ID,
    });

    const newTodo = {
      title: query.trim(),
      completed: false,
      userId: USER_ID,
    };

    addTodo(newTodo);
  };

  const toggleCompletedAll = () => {
    setTodos(prevTodos => {
      const allCompleted = prevTodos.every(todo => todo.completed);
      const updatedTodos = prevTodos.map(todo => ({
        ...todo,
        completed: !allCompleted,
      }));

      return updatedTodos;
    });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        onClick={toggleCompletedAll}
      />

      <form name="todo-text" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          value={query}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => setQuery(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
