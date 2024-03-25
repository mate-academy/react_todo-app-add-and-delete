/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { USER_ID, createTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.All);
  const [todoTitle, setTodoTitle] = useState('');

  useEffect(() => {
    getTodos()
      .then(todosData => {
        setTodos(todosData);
        setError('');
      })
      .catch(() => {
        setError('Unable to load todos');
      });

    const timeoutId = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filterTodos = (filter: Filter): Todo[] => {
    switch (filter) {
      case Filter.All:
        return todos;

      case Filter.Active:
        return todos.filter(todo => !todo.completed);

      case Filter.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  const filteredTodos = filterTodos(selectedFilter);

  const addTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
    createTodo({ title, userId, completed }).then(newTodo => {
      setTodos(currentTodos => [...currentTodos, newTodo] as Todo[]);
    });
  };

  const handleFromSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!todoTitle) {
      setError('Title should not be empty');

      return;
    }

    addTodo({ title: todoTitle.trim(), userId: USER_ID, completed: false });
    setTodoTitle('');
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleFromSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={event => setTodoTitle(event?.target.value)}
              autoFocus
            />
          </form>
        </header>

        {!!todos.length && (
          <>
            <TodoList todos={filteredTodos} />

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {todos.filter(todo => !todo.completed).length} items left
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={classNames('filter__link', {
                    selected: selectedFilter === Filter.All,
                  })}
                  data-cy="FilterLinkAll"
                  onClick={() => setSelectedFilter(Filter.All)}
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={classNames('filter__link', {
                    selected: selectedFilter === Filter.Active,
                  })}
                  data-cy="FilterLinkActive"
                  onClick={() => setSelectedFilter(Filter.Active)}
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={classNames('filter__link', {
                    selected: selectedFilter === Filter.Completed,
                  })}
                  data-cy="FilterLinkCompleted"
                  onClick={() => setSelectedFilter(Filter.Completed)}
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
          </>
        )}
      </div>

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
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {error}
      </div>
    </div>
  );
};
