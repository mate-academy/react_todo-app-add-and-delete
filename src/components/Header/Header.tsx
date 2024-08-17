import React, { useRef, useState, useEffect } from 'react';
import { Todo } from '../../types/Todo';
import { addTodo, updateTodoStatus, USER_ID } from '../../api/todos';
import cn from 'classnames';

type Props = {
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todos: Todo[];
  errorMessage: string;
  setLoadingTodosId: React.Dispatch<React.SetStateAction<number[]>>;
  loadingTodosId: number[];
  addIdToLoad: (arg: number) => void;
};

export const Header: React.FC<Props> = ({
  setErrorMessage,
  setTempTodo,
  setTodos,
  todos,
  errorMessage,
  setLoadingTodosId,
  loadingTodosId,
  addIdToLoad,
}) => {
  const [query, setQuery] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (!query.trim()) {
      return setErrorMessage('Title should not be empty');
    }

    const forFetchTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: query.toString().trim(),
      completed: false,
    };

    setTempTodo({
      ...forFetchTodo,
      id: 0,
    });

    addIdToLoad(0);

    try {
      const addedTodo = await addTodo(forFetchTodo);

      setTodos(prevTodos => [...prevTodos, addedTodo]);
      setTempTodo(null);
      setQuery('');
      inputRef.current?.focus();
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setTempTodo(null);
      throw error;
    } finally {
      setLoadingTodosId([]);
      inputRef.current?.focus();
    }
  };

  const handleOnClick = async () => {
    let activeTodosId: number[] = [];

    try {
      if (todos.some(todo => !todo.completed)) {
        activeTodosId = todos
          .filter(todo => !todo.completed)
          .map(todo => todo.id);

        setLoadingTodosId(prev => [...prev, ...activeTodosId]);
        await Promise.all(activeTodosId.map(id => updateTodoStatus(id, true)));
      } else {
        activeTodosId = todos
          .filter(todo => todo.completed)
          .map(todo => todo.id);
        setLoadingTodosId(prev => [...prev, ...activeTodosId]);
        await Promise.all(activeTodosId.map(id => updateTodoStatus(id, false)));
      }

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          activeTodosId.includes(todo.id)
            ? { ...todo, completed: !todo.completed }
            : todo,
        ),
      );
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      throw error;
    } finally {
      setLoadingTodosId([]);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, errorMessage]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length !== 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleOnClick}
        />
      )}

      <form onSubmit={handleOnSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleOnChange}
          disabled={loadingTodosId.length > 0}
        />
      </form>
    </header>
  );
};
