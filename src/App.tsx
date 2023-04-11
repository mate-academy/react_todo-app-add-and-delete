/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './components/UserWarning/UserWarning';

import { getTodos, postTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './utils/filterTypes';

import { Loader } from './components/Loader/Loader';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';

const USER_ID = 6979;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo>();
  const [query, setQuery] = useState('');
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const [deletingCompleted, setDeletingCompleted] = useState(false);

  const clearError = () => {
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const loadTodos = async () => {
    setIsLoading(true);

    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setError('Unable to load a todo');

      clearError();

      setTodos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async (title: string) => {
    setIsDisabledInput(true);

    const newTodo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    try {
      const data = await postTodo(newTodo);

      setTodos(state => [...state, data]);
    } catch {
      setError('Unable to add a todo');
      clearError();
    } finally {
      setIsDisabledInput(false);
      setTempTodo(undefined);
    }
  };

  const removeTodo = async (id: number) => {
    try {
      await deleteTodo(id);

      setTodos(() => todos.filter(todo => todo.id !== id));
    } catch {
      setError('Unable to delete a todo');
      clearError();
    }
  };

  const removeCompleted = () => {
    const completed = todos.filter(todo => todo.completed);

    setDeletingCompleted(true);

    completed.forEach(todo => {
      removeTodo(todo.id)
        .then(() => setTodos(todos.filter(item => !item.completed)))
        .catch(() => setError('Unable to delete todos'))
        .finally(() => setDeletingCompleted(false));
    });
  };

  const filterTodos = (allTodos: Todo[], filterMode: FilterType): Todo[] => {
    switch (filterMode) {
      case FilterType.Active:
        return allTodos.filter(todo => !todo.completed);

      case FilterType.Completed:
        return allTodos.filter(todo => todo.completed);

      default:
        return allTodos;
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      setError("Title can't be empty");
      setIsDisabledInput(true);
      setQuery('');
      setTimeout(() => {
        setError('');
        setIsDisabledInput(false);
      }, 2500);
    }

    addTodo(query);
    setQuery('');
  };

  const visibleTodos = filterTodos(todos, filterType);

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            aria-label="Toggle all"
          />

          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={handleInputChange}
              disabled={isDisabledInput}
            />
          </form>
        </header>

        {isLoading && <Loader />}

        {visibleTodos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            onDelete={removeTodo}
            deletingCompleted={deletingCompleted}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={visibleTodos}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
            onRemoveCompleted={removeCompleted}
          />
        )}
      </div>

      <div className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
      >
        <button type="button" className="delete" />
        {error}
      </div>
    </div>
  );
};
