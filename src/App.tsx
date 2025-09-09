/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { TodoRow } from './components/TodoRow';
import { TodoItem } from './components/TodoItem';

enum ErrorMessage {
  Load = 'Unable to load todos',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Title = 'Title should not be empty',
}

enum FilterOption {
  All,
  Active,
  Completed,
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterOption, setFilterOption] = useState<FilterOption>(
    FilterOption.All,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processTodoIds, setProcessTodoIds] = useState<number[]>([]);

  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<ErrorMessage | null>(null);
  const [loader, setLoader] = useState(false);

  function sorterTodos(filterStatus: FilterOption) {
    switch (filterStatus) {
      case FilterOption.Active:
        return todos.filter((t: Todo) => !t.completed);
      case FilterOption.Completed:
        return todos.filter((t: Todo) => t.completed);
      default:
        return todos;
    }
  }

  function loadTodos() {
    todoService
      .getTodos()
      .then(data => {
        setTodos(data);
        setTimeout(() => inputRef.current?.focus(), 0);
      })
      .catch(() => {
        setError(ErrorMessage.Load);
      });
  }

  function creationOfTodo(title: string) {
    setLoader(true);

    const temp: Todo = {
      id: 0,
      title,
      userId: 0,
      completed: false,
    };

    setTempTodo(temp);

    todoService
      .createTodo({ title })
      .then(createdTodo => {
        setTodos(prev => [...prev, createdTodo]);
        setInput('');
      })
      .catch(() => {
        setError(ErrorMessage.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setTimeout(() => inputRef.current?.focus(), 0);
        setLoader(false);
      });
  }

  function deleteTodo(todoId: number) {
    setProcessTodoIds(ids => [...ids, todoId]);

    setLoader(true);

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== todoId));
      })
      .catch(() => {
        setError(ErrorMessage.Delete);
      })
      .finally(() => {
        setTimeout(() => inputRef.current?.focus(), 0);
        setLoader(false);
        setProcessTodoIds(ids => ids.filter(id => id !== todoId));
      });
  }

  function deleteAllCompleted() {
    todos.filter(todo => todo.completed).map(todo => deleteTodo(todo.id));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (input.trim().length > 0) {
      creationOfTodo(input.trim());
    } else {
      setError(ErrorMessage.Title);
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }, [error]);

  if (!todoService.USER_ID) {
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
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={input}
              onChange={e => {
                setInput(e.target.value);
              }}
              ref={inputRef}
              disabled={loader ? true : false}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {sorterTodos(filterOption).map(todo => {
            return (
              <TodoRow
                todo={todo}
                loader={loader}
                key={todo.id}
                chosenTodoIds={processTodoIds}
                deleteTodo={deleteTodo}
              />
            );
          })}
          {tempTodo && <TodoItem tempTodo={tempTodo} />}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${todos.filter(t => !t.completed).length} items left`}
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filterOption === FilterOption.All,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilterOption(FilterOption.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filterOption === FilterOption.Active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilterOption(FilterOption.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filterOption === FilterOption.Completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilterOption(FilterOption.Completed)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!todos.some(t => t.completed)}
              onClick={deleteAllCompleted}
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
          'notification is-danger is-light has-text-weight-normal',
          { hidden: error === null },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {error && (
          <>
            {error}
            <br />
          </>
        )}
      </div>
    </div>
  );
};
