/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';

enum FilterStatus {
  Active = 'active',
  All = 'all',
  Completed = 'completed',
}

function getFilteredTodos(todos: Todo[], query: string) {
  const preparedTodos = todos.filter(todo => {
    switch (query) {
      case FilterStatus.Active:
        return !todo.completed;
      case FilterStatus.Completed:
        return todo.completed;
      default:
        return todos;
    }
  });

  return preparedTodos;
}

function isCompleted(todo: Todo) {
  return todo.completed;
}

function isUncompleted(todo: Todo) {
  return !todo.completed;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState(FilterStatus.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setErrorVisible(true);
        setTimeout(() => {
          setErrorVisible(false);
        }, 3000);
      });
  }, []);

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  const reset = () => {
    setTitle('');
  };

  function addTodo({ userId, completed }: Todo) {
    return todoService
      .createTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');
        setErrorVisible(true);
        setTimeout(() => {
          setErrorVisible(false);
        }, 3000);
        throw error;
      });
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title || title.trim() === '') {
      setErrorMessage('Title should not be empty');
      setErrorVisible(true);
      setTimeout(() => {
        setErrorVisible(false);
      }, 3000);

      return;
    }

    const inputTitle = title.trim();

    const temporaryTodo: Todo = {
      id: 0,
      userId: todoService.USER_ID,
      title: inputTitle,
      completed: false,
    };

    setTempTodo(temporaryTodo);

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    addTodo({
      id: 0,
      userId: todoService.USER_ID,
      title: inputTitle,
      completed: false,
    })
      .then(() => {
        reset();
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setTempTodo(null);
      })
      .catch(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }
      })
      .finally();
  };

  function updateTodo(updatedTodo: Todo) {
    setLoadingTodoIds(prevIds => [...prevIds, updatedTodo.id]);
    todoService
      .updateTodo(updatedTodo)
      .then(todo => {
        setTodos(currentTodos => {
          const newTodo = todo;
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(
            todoOpt => todoOpt.id === updatedTodo.id,
          );

          if (todo.completed === false) {
            newTodo.completed = true;
            newTodos.splice(index, 1, newTodo);

            return newTodos;
          } else {
            newTodo.completed = false;
            newTodos.splice(index, 1, newTodo);

            return newTodos;
          }
        });
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setErrorVisible(true);
        setTimeout(() => {
          setErrorVisible(false);
        }, 3000);
      })
      .finally(() =>
        setLoadingTodoIds(prevIds =>
          prevIds.filter(id => id !== updatedTodo.id),
        ),
      );
  }

  function checkAllTodos(todosAll: Todo[]) {
    const todosNotCompleted = todosAll.filter(todo => todo.completed === false);

    if (todosNotCompleted.length > 0) {
      todosNotCompleted.forEach(todo => updateTodo(todo));
    } else {
      todos.forEach(todo => updateTodo(todo));
    }
  }

  const visibleTodos = getFilteredTodos(todos, query);
  let todosAllCompleted;

  if (visibleTodos.length > 0) {
    todosAllCompleted = visibleTodos.every(isCompleted);
  } else {
    todosAllCompleted = false;
  }

  const todosAllUncomplited = visibleTodos.every(isUncompleted);
  const completedTodos = todos.filter(todo => todo.completed === false);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {!!todos.length && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: todosAllCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={() => checkAllTodos(visibleTodos)}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={handleTitleChange}
              ref={inputRef}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <div
              data-cy="Todo"
              className={cn('todo', {
                completed: todo.completed,
              })}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  onChange={() => updateTodo(todo)}
                  checked={todo.completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={cn('modal', 'overlay', {
                  'is-active': loadingTodoIds.includes(todo.id),
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
          {tempTodo && (
            <div 
              data-cy="Todo"
              className={cn('todo', {
                completed: tempTodo.completed,
              })}
              key={tempTodo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  onChange={() => updateTodo(tempTodo)}
                  checked={tempTodo.completed}
                />
              </label>

              <span className="todo__title">{tempTodo.title}</span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>
              <div
                data-cy="TodoLoader"
                className={cn('modal', 'overlay', {
                  'is-active': tempTodo,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>

            </div>
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${completedTodos.length} items left`}
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: query === FilterStatus.All,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setQuery(FilterStatus.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: query === FilterStatus.Active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setQuery(FilterStatus.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: query === FilterStatus.Completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setQuery(FilterStatus.Completed)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todosAllUncomplited}
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
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !errorVisible,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            setErrorVisible(false);
          }}
        />
        {errorMessage}
      </div>
    </div>
  );
};
