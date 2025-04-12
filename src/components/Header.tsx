import React, { useEffect, useState } from 'react';
import { createTodo } from '../api/todos';
import { Todo } from '../types/Todo';
type Props = {
  inputRef: React.RefObject<HTMLInputElement>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
const Header = ({
  inputRef,
  setTempTodo,
  setError,
  isLoading,
  setIsLoading,
}: Props) => {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading, inputRef]);

  const addTodo = async () => {
    const temp: Todo = {
      id: 0,
      title: query.trim(),
      completed: false,
      userId: 0,
    };

    setTempTodo(temp);
    setIsLoading(true);
    try {
      const res = await createTodo(query);

      setTempTodo(res);
      setError('');
      setQuery('');
    } catch {
      setError('Unable to add a todo');
      setTempTodo(null);
      setQuery(temp.title);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() === '') {
      return setError('Title should not be empty');
    }

    addTodo();
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={e => setQuery(e.target.value)}
          disabled={isLoading}
          ref={inputRef}
        />
      </form>
    </header>
  );
};

export default Header;
