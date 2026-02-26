import { addTodo } from '../api/todos';
import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';
import { ErrorType } from '../enums/error';

type Props = {
  todos: Todo[];
  query: string;
  setQuery: (query: string) => void;
  setHasError: (hasError: string) => void;
  loading: number[];
  loadingInput: boolean;
  setLoadingInput: (loading: boolean) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo>>;
  pressButtonToggleAll: boolean;
  setPressButtonToggleAll: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SearchBar: React.FC<Props> = ({
  todos,
  query,
  setQuery,
  setHasError,
  loadingInput,
  setLoadingInput,
  setTodos,
  setTempTodo,
  setPressButtonToggleAll,
  loading,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the input element after the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [loadingInput, loading]);

  const handleSubmit = event => {
    event.preventDefault();
    setHasError(ErrorType.RESET_ERROR);

    const trimmedQuery = query.trim();

    if (trimmedQuery.length === 0) {
      setHasError(ErrorType.TITLE_IS_EMPTY);

      return;
    }

    setLoadingInput(true);

    const temp: Todo = {
      id: 0,
      title: trimmedQuery,
      completed: false,
    };

    setTempTodo(temp);

    addTodo(trimmedQuery)
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);

        setQuery('');
      })
      .catch(() => {
        setHasError(ErrorType.ADD);
      })
      .finally(() => {
        setLoadingInput(false);
        setTempTodo(null);
      });
  };

  const todoComletedLength = todos.filter(
    (todo: Todo) => todo.completed,
  ).length;

  const changeStatusToglleAllButton = () => {
    if (todoComletedLength !== todos.length) {
      setPressButtonToggleAll(true);
    } else {
      setPressButtonToggleAll(false);
    }
  }

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${todoComletedLength === todos.length ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={changeStatusToglleAllButton}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          disabled={loadingInput}
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setHasError(ErrorType.RESET_ERROR);
          }}
        />
      </form>
    </header>
  );
};

export default SearchBar;
