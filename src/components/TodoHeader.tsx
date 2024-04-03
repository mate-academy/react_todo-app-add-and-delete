import { FC, FormEvent, useEffect, useRef } from 'react';
import { useTodos } from '../utils/TodosContext';
import { USER_ID } from '../api/todos';
import { Error } from '../types';

export const TodoHeader: FC = () => {
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim()) {
      setError(Error.TITLE_IS_EMPTY);

      return;
    }

    const newTodo = {
      id: 0,
      title: query.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);
    addTodo(newTodo);
  };

  const toggleCompletedForAll = () => {
    setTodos(prevTodos => {
      const allCompleted = prevTodos.every(todo => todo.completed);
      const updatedTodos = prevTodos.map(todo => ({
        ...todo,
        completed: !allCompleted,
      }));

      return [...updatedTodos];
    });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        onClick={toggleCompletedForAll}
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
