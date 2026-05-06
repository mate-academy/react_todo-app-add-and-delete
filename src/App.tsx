/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { ErrorMessage } from './types/Error';
import { Todo } from './types/Todo';
import { getTodos, deleteTodos, postTodos, patchTodos } from './api/todos';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  const [fieldValue, setFieldValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isClearing, setIsClearing] = useState(false);

  const showError = (message: string) => {
    setErrorMessage(message);
  };

  useEffect(() => {
    const isDeleting = loadingIds.length > 0;

    if (!isLoading && tempTodo === null && !isDeleting && !isClearing) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isLoading, tempTodo, loadingIds, isClearing]);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    const fetchTodos = async () => {
      try {
        const data = await getTodos();

        setTodos(data);
      } catch (error) {
        showError(ErrorMessage.LOAD);
      }
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const areAllCompleted = todos.every(todo => todo.completed);
  const activeCount = todos.filter(todo => !todo.completed).length;

  const handleToggleAllButton = async () => {
    try {
      const newStatus = !areAllCompleted;

      const updatePromises = todos.map(todo =>
        patchTodos(todo.id, { completed: newStatus }),
      );

      const updatedTodos = await Promise.all(updatePromises);

      setTodos(updatedTodos);
    } catch (error) {
      showError(ErrorMessage.UPDATE);
    }
  };

  const updateChecked = async (todo: Todo) => {
    try {
      const newStatus = !todo.completed;
      const updateTodo = await patchTodos(todo.id, { completed: newStatus });
      const updatedTodo = todos.map(oldTodo =>
        oldTodo.id === updateTodo.id ? updateTodo : oldTodo,
      );

      setTodos(updatedTodo);
    } catch (error) {
      setErrorMessage(ErrorMessage.UPDATE);
    }
  };

  const deleteTodo = async (id: number) => {
    setLoadingIds(prev => [...prev, id]);

    try {
      await deleteTodos(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage(ErrorMessage.DELETE);
    } finally {
      setLoadingIds(prev => prev.filter(x => x !== id));
    }
  };

  const postTodo = async (title: string) => {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setErrorMessage(ErrorMessage.EMPTY_TITLE);

      return;
    }

    setIsLoading(true);

    const temp: Todo = {
      id: 0,
      title: normalizedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(temp);

    try {
      const newTask = await postTodos({
        title: normalizedTitle,
        userId: USER_ID,
        completed: false,
      });

      setTodos(prev => [...prev, newTask]);
      setFieldValue('');
    } catch (error) {
      setErrorMessage(ErrorMessage.ADD);
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    postTodo(fieldValue);
  };

  const changeFilter = (newFilter: string) => {
    setFilter(newFilter);
  };

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const clearCompleted = async () => {
    setIsClearing(true);

    try {
      const completedTodos = todos.filter(todo => todo.completed);

      const results = await Promise.allSettled(
        completedTodos.map(todo => deleteTodos(todo.id)),
      );

      const hasErrors = results.some(result => result.status === 'rejected');

      const successfulIds = results
        .map((result, index) =>
          result.status === 'fulfilled' ? completedTodos[index].id : null,
        )
        .filter((id): id is number => id !== null);

      setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));

      if (hasErrors) {
        setErrorMessage(ErrorMessage.DELETE);
      }
    } catch (error) {
      setErrorMessage(ErrorMessage.DELETE);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${areAllCompleted ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={handleToggleAllButton}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              disabled={isLoading}
              data-cy="NewTodoField"
              type="text"
              value={fieldValue}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={event => setFieldValue(event.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              updateChecked={updateChecked}
              deleteTodo={deleteTodo}
              isLoading={loadingIds.includes(todo.id)}
            />
          ))}

          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              updateChecked={() => { }}
              deleteTodo={() => { }}
              isLoading={true}
            />
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeCount} items left`}
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => changeFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => changeFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => changeFilter('completed')}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={() => clearCompleted()}
              disabled={!todos.some(todo => todo.completed)}
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
        className={`${errorMessage ? '' : 'hidden'} notification is-danger is-light has-text-weight-normal`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
