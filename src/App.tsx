import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID, addTodo, deleteTodo, getTodos,
} from './api/todos';
import { Todo, Filter } from './types/Todo';
import { TodoItem } from './components/Item/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const visibleTodos = () => {
    return todos.filter(todo => !todo.completed);
  };

  const activeTodos = () => {
    const active = [...todos].filter(todo => {
      if (filter === 'Active' && todo.completed) {
        return false;
      }

      if (filter === 'Completed' && !todo.completed) {
        return false;
      }

      return true;
    });

    return active;
  };

  const errorHandler = (set: (arg0: string) => void, error: string) => {
    set(error);
    setTimeout(() => {
      set('');
    }, 3000);
  };

  const handleAddTodo = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!title.trim()) {
      errorHandler(setErrorMessage, 'Title should not be empty');

      return;
    }

    const newTempTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTempTodo);

    setIsLoading(true);
    addTodo(newTempTodo).then((newTodo) => {
      setTitle('');
      setTodos((oldTodos) => [...oldTodos, newTodo]);
    }).catch(() => {
      errorHandler(setErrorMessage, 'Unable to add a todo');
    }).finally(() => {
      setIsLoading(false);
      setTempTodo(null);
    });
  };

  const handleDeleteTodo = (todoId: number) => {
    deleteTodo(todoId).then(() => {
      setTodos((oldTodos) => oldTodos.filter(todo => todo.id !== todoId));
    }).catch(() => {
      errorHandler(setErrorMessage, 'Unable to delete a todo');
    });
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((todo) => {
        setTodos(todo);
        setTitle('');
      })
      .catch(() => {
        errorHandler(setErrorMessage, 'Unable to load todos');
      }).finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length && (
          // eslint-disable-next-line jsx-a11y/control-has-associated-label
            <button
              type="button"
              className={cn('todoapp__toggle-all', { active: todos.length })}
              data-cy="ToggleAllButton"
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
              disabled={isLoading}
              ref={(input) => input && input.focus()}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </form>
        </header>
        {todos.length > 0
        && (
          <section className="todoapp__main" data-cy="TodoList">
            {activeTodos().map((todo) => {
              return (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  handleDelete={handleDeleteTodo}
                />
              );
            })}
            {tempTodo
            && (
              <TodoItem
                todo={tempTodo}
                handleDelete={handleDeleteTodo}
              />
            )}
          </section>
        )}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${visibleTodos().length} items left`}
            </span>
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', { selected: filter === 'All' })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('All')}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link',
                  { selected: filter === 'Active' })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('Active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link',
                  { selected: filter === 'Completed' })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('Completed')}
              >
                Completed
              </a>
            </nav>
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          !errorMessage && 'hidden'
        }`}
      >
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => errorHandler(setErrorMessage, '')}
        />
        {errorMessage}
        <br />
      </div>
    </div>
  );
};
