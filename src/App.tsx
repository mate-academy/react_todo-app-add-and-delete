/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodos, deleteTodos, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';

import { Filter } from './types/FilterButton';
import { Error } from './types/ErrorMessage';
import { CompletedTodo } from './components/CompletedTodo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Error>(Error.Reset);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [inputValue, setInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loadingTodoId, setloadingTodoId] = useState<number[]>([]);

  const onDeleteTodo = async (todoId: number) => {
    setloadingTodoId(prev => [...prev, todoId]);
    try {
      await deleteTodos(todoId);

      setTodos(item => item.filter(todo => todo.id !== todoId));
    } catch (err) {
      setError(Error.Delete);
    } finally {
      setloadingTodoId(prev => prev.filter(id => id !== todoId));
    }
  };

  const onAddTodo = async (todoTitle: string) => {
    setTempTodo({ id: 0, title: todoTitle, completed: false, userId: USER_ID });
    try {
      const newTodo = await addTodos({ title: todoTitle, completed: false });

      setTodos(item => [...item, newTodo]);
    } catch (err) {
      setError(Error.Add);
      throw err;
    } finally {
      setTempTodo(null);
    }
  };

  const onClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      onDeleteTodo(todo.id);
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue.trim() === '') {
      setError(Error.Empty);

      return;
    }

    try {
      await onAddTodo(inputValue.trim());
      setInputValue('');
    } catch (err) {}
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [loadingTodoId, tempTodo]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError(Error.Load));
    const timer = setTimeout(() => setError(Error.Reset), 3000);

    return () => clearTimeout(timer);
  }, []);

  const filteredTodos = todos.filter(todo => {
    if (filter === Filter.Active) {
      return !todo.completed;
    }

    if (filter === Filter.Completed) {
      return todo.completed;
    }

    return Filter.All;
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  const unCompletedTodosCounter = todos.filter(todo => !todo.completed).length;
  const todosCompletedNum = todos.filter(todo => todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleSubmit}>
            <input
              value={inputValue}
              onChange={event => setInputValue(event.target.value)}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={inputRef}
              disabled={!!tempTodo}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <CompletedTodo
              key={todo.id}
              todo={todo}
              onDelete={onDeleteTodo}
              isLoading={loadingTodoId.includes(todo.id)}
            />
          ))}
          {tempTodo && (
            <CompletedTodo todo={tempTodo} isLoading onDelete={onDeleteTodo} />
          )}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {unCompletedTodosCounter} items left
            </span>
            <nav className="filter" data-cy="Filter">
              <button
                className={classNames('filter__link', {
                  selected: filter === 'all',
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter(Filter.All)}
              >
                All
              </button>

              <button
                className={classNames('filter__link', {
                  selected: filter === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter(Filter.Active)}
              >
                Active
              </button>

              <button
                className={classNames('filter__link', {
                  selected: filter === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter(Filter.Completed)}
              >
                Completed
              </button>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={onClearCompleted}
              disabled={todosCompletedNum === 0}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(Error.Reset)}
        />
        {/* show only one message at a time */}
        {error}
        {/* <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
