/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { USER_ID, getTodos } from './api/todos';
import { TodoComponent } from './components/TodoComponent/TodoComponent';
import { Filter } from './types/Filter';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';
import { TodoForm } from './components/TodoForm/TodoForm';

function prepareTodos(todos: Todo[], filter: Filter): Todo[] {
  let todosCopy = [...todos];

  if (filter === Filter.Active) {
    todosCopy = todosCopy.filter(todo => todo.completed === false);
  }

  if (filter === Filter.Completed) {
    todosCopy = todosCopy.filter(todo => todo.completed === true);
  }

  return todosCopy;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [errorMessage, setErrorMessage] = useState('');

  const addTodo = (todo: Todo): void => {
    setTodos((prevTodos) => ([...prevTodos, todo]));
  };

  const handleTempTodo = (value: null | Todo):void => {
    setTempTodo(value);
  };

  function setErrorHide():void {
    if (errorMessage) {
      setErrorMessage('');
    }
  }

  const preparedTodos = prepareTodos(todos, filter);

  useEffect(() => {
    getTodos(USER_ID)
      .then((todosServer) => {
        setTodos(todosServer);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    const timerId = setTimeout(setErrorHide, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <TodoForm
            setError={setErrorMessage}
            addTodo={addTodo}
            handleTempTodo={handleTempTodo}
          />
        </header>

        {todos && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {preparedTodos?.map(todo => (
                <TodoComponent todo={todo} key={todo.id} />
              ))}
            </section>
            {!!tempTodo && (<TodoComponent todo={tempTodo} />)}
            {/* Hide the footer if there are no todos */}
            {todos.length > 0 && (
              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="TodosCounter">
                  {`${todos.filter(t => !t.completed).length} items left`}
                </span>

                {/* Active filter should have a 'selected' class */}
                <nav className="filter" data-cy="Filter">
                  <a
                    href="#/"
                    className={classNames('filter__link', {
                      selected: filter === Filter.All,
                    })}
                    data-cy="FilterLinkAll"
                    onClick={() => setFilter(Filter.All)}
                  >
                    All
                  </a>

                  <a
                    href="#/active"
                    className={classNames('filter__link', {
                      selected: filter === Filter.Active,
                    })}
                    data-cy="FilterLinkActive"
                    onClick={() => setFilter(Filter.Active)}
                  >
                    Active
                  </a>

                  <a
                    href="#/completed"
                    className={classNames('filter__link', {
                      selected: filter === Filter.Completed,
                    })}
                    data-cy="FilterLinkCompleted"
                    onClick={() => setFilter(Filter.Completed)}
                  >
                    Completed
                  </a>
                </nav>

                {/* don't show this button if there are no completed todos */}
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  data-cy="ClearCompletedButton"
                >
                  Clear completed
                </button>
              </footer>
            )}
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorHide={setErrorHide}
      />
    </div>
  );
};
