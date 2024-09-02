/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import * as service from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem/TodoItem';

enum Filter {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterTodos, setFilterTodos] = useState<Filter>(Filter.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [todoTitle, setTodoTitle] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    service
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMessage]);

  const filteredTodos = todos.filter(todo => {
    if (filterTodos === 'ACTIVE') {
      return !todo.completed;
    } else if (filterTodos === 'COMPLETED') {
      return todo.completed;
    }

    return true;
  });

  const todosAmount = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);

  if (!service.USER_ID) {
    return <UserWarning />;
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    setTodoTitle(event.target.value);
  };

  const addTodo = ({ title }: { title: string }) => {
    if (title.trim() === '') {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: service.USER_ID,
      title: title,
      completed: false,
    };

    setTempTodo(newTempTodo);

    service
      .createTodos({ userId: service.USER_ID, title, completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
        setTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTempTodo(null);
        setTodoTitle(newTempTodo.title);
      });
  };

  const deleteTodo = (todoId: number) => {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

    return service.deleteTodos(todoId).catch(() => {
      setTodos(todos);
      setErrorMessage('Unable to delete a todo');
    });
  };

  const deleteCompleted = (completed: Todo[]) => {
    for (const completedTodo of completed) {
      if (completedTodo.completed) {
        deleteTodo(completedTodo.id);
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    addTodo({ title: todoTitle });
    setTodoTitle('');
  };

  const handleButtonClose = () => {
    setErrorMessage('');
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length !== 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: completedTodos.length === todos.length,
              })}
              data-cy="ToggleAllButton"
              onClick={() => {
                if (completedTodos.length === todos.length) {
                  deleteCompleted(todos);
                }
              }}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={handleTitleChange}
              autoFocus
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} onDelete={deleteTodo} />
          ))}
          {tempTodo && <TodoItem todo={tempTodo} />}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todosAmount} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filterTodos === 'ALL',
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilterTodos(Filter.ALL)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filterTodos === 'ACTIVE',
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilterTodos(Filter.ACTIVE)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filterTodos === 'COMPLETED',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilterTodos(Filter.COMPLETED)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            {completedTodos.length !== 0 && (
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={() => deleteCompleted(completedTodos)}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleButtonClose}
        />
        {/* show only one message at a time */}
        {/* Unable to load todos
          <br />
          Title should not be empty
          <br />
          Unable to add a todo
          <br />
          Unable to delete a todo
          <br />
          Unable to update a todo */}
        {errorMessage}
      </div>
    </div>
  );
};
