/* eslint-disable no-console */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { addTodo, getTodos, removeTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/Todo';
import { Status } from './types/Status';

const USER_ID = 12035;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [removingTodoId, setRemovingTodoId] = useState<number | null>(null);
  const [filterByStatus, setFilterByStatus] = useState<string>(Status.All);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<null | string>(null);
  const [showError, setShowError] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputIsDisabled, setInputIsDisabled] = useState(false);
  const [isTodosCompleted, setIsTodosCompleted] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  useEffect(() => {
    const updateIsTodosCompleted = () => {
      const isAnyTodoCompleted = todos.some(todo => todo.completed);

      setIsTodosCompleted(isAnyTodoCompleted);
    };

    updateIsTodosCompleted();
  }, [todos]);

  const removeCompletedTodos = async () => {
    const completedTodosIds = todos.filter(todo => todo.completed)
      .map(todo => todo.id);
    const successfulDeletions: number[] = [];

    try {
      await Promise.all(completedTodosIds.map(async (todoId) => {
        await removeTodo(todoId, USER_ID);
        successfulDeletions.push(todoId);
      }));

      setTodos(todos.filter(todo => !successfulDeletions.includes(todo.id)));
    } catch {
      setShowError(true);
      setError('Some todos could not be deleted.');
      setTimeout(() => {
        setShowError(false);
      }, 3000);

      setTodos(todos.filter(todo => !successfulDeletions.includes(todo.id)));
    }
  };

  const hideErrorMessage = () => {
    setShowError(false);
  };

  const changeFilter = (newFilter: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setFilterByStatus(newFilter);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // eslint-disable-next-line max-len
  const handleSaveTodo = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      hideErrorMessage();
      const trimmedTitle = inputValue.trim();

      if (trimmedTitle) {
        setInputValue('');
        setInputIsDisabled(true);

        try {
          const newTodo = await addTodo(trimmedTitle, USER_ID, false);

          setTempTodo({
            id: 0,
            userId: USER_ID,
            title: trimmedTitle,
            completed: false,
          });

          setTimeout(() => {
            setTodos([...todos, newTodo]);
            setTempTodo(null);
          }, 600);
        } catch (catchError) {
          setShowError(true);
          setError('Unable to add a todo.');
          setTimeout(() => {
            setShowError(false);
          }, 3000);
        } finally {
          setInputIsDisabled(false);
        }
      } else {
        setShowError(true);
        setError('Title should not be empty.');
        setTimeout(() => {
          setShowError(false);
        }, 3000);
      }
    }
  };

  const handleRemoveTodo = async (todoId: number) => {
    setRemovingTodoId(todoId);

    try {
      await removeTodo(todoId, USER_ID);

      const updatedTodos = todos.filter(todo => todo.id !== todoId);

      setTimeout(() => {
        setTodos(updatedTodos);
        setRemovingTodoId(null);
      }, 600);
    } catch (e) {
      setShowError(true);
      setError('Unable to delete a todo.');
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      setRemovingTodoId(null);
    }
  };

  useEffect(() => {
    if (!inputIsDisabled) {
      inputRef.current?.focus();
    }
  }, [inputIsDisabled]);

  useEffect(() => {
    const loadData = async () => {
      setShowError(false);
      setError(null);
      getTodos(USER_ID)
        .then(setTodos)
        .catch(() => {
          setShowError(true);
          setError('Unable to load todos');
          setTimeout(() => {
            setShowError(false);
          }, 3000);
        });
    };

    loadData();
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const filterTodos = (filter: string) => {
      switch (filter) {
        case Status.Active:
          return todos.filter(todo => !todo.completed);

        case Status.Completed:
          return todos.filter(todo => todo.completed);

        default:
          return todos;
      }
    };

    setFilteredTodos(
      filterTodos(filterByStatus),
    );
  }, [filterByStatus, todos]);

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
          <form>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={inputIsDisabled}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleSaveTodo}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onRemove={handleRemoveTodo}
              removingTodoId={removingTodoId}
            />
          ))}

          {tempTodo !== null && (
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              {/* 'is-active' class puts this modal on top of the todo */}
              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {todos.length !== 0 ? (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodosCount} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn(
                  'filter__link',
                  { selected: filterByStatus === Status.All },
                )}
                data-cy="FilterLinkAll"
                onClick={changeFilter(Status.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn(
                  'filter__link',
                  { selected: filterByStatus === Status.Active },
                )}
                data-cy="FilterLinkActive"
                onClick={changeFilter(Status.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn(
                  'filter__link',
                  { selected: filterByStatus === Status.Completed },
                )}
                data-cy="FilterLinkCompleted"
                onClick={changeFilter(Status.Completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={removeCompletedTodos}
              disabled={!isTodosCompleted}
            >
              Clear completed
            </button>
          </footer>
        )
          : ''}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {showError && (
        <div
          data-cy="ErrorNotification"
          id="errorMessage"
          className="
          notification is-danger is-light has-text-weight-normal
        "
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={hideErrorMessage}
          />
          {error && <span>{error}</span>}
        </div>
      )}
    </div>
  );
};
