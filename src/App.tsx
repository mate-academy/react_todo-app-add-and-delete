/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterTodos';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState('all');
  const [showUpdateInput, setShowUpdateInput] = useState(false);
  const [disable, setDisable] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const allCompleted = todos.every(todo => todo.completed);
  const focusRef = useRef<HTMLInputElement | null>(null);

  function focusInput() {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  }

  useEffect(() => {
    focusInput();
    setLoading(true);
    todoService
      .getTodos()
      .then(todoFromServer => setTodos(todoFromServer))
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setError(true);
      })
      .finally(() => {
        setLoading(false);
        focusInput();
      });
  }, []);

  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (error) {
      timer.current = setTimeout(() => {
        setError(false);
      }, 3000);
    }

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [error]);

  useEffect(() => {
    if (!disable) {
      focusInput();
    }
  }, [disable]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const filterTodos = todos.filter(todo => {
    switch (filter) {
      case FilterType.active:
        return !todo.completed;
      case FilterType.completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim() === '') {
      setErrorMessage('Title should not be empty');
      setError(true);

      return;
    }

    setDisable(true);
    let requestSuccessful = false;
    const temptodo: Todo = {
      userId: todoService.USER_ID,
      title: title.trimStart().trimEnd(),
      completed: false,
      id: 0,
    };

    setLoadingTodoIds(prev => [...prev, temptodo.id]);
    setTempTodo(temptodo);
    todoService
      .createTodo(temptodo)
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        requestSuccessful = true;
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setError(true);
        setTitle(title);
      })
      .finally(() => {
        setDisable(false);
        setLoadingTodoIds(prev => prev.filter(id => id !== temptodo.id));
        setTempTodo(null);
        if (requestSuccessful) {
          setTitle('');
        }
      });
  };

  const handleComplitedToDo = (upTodo: Todo) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { id, title, completed } = upTodo;

    setLoadingTodoIds(prev => [...prev, id]);

    todoService
      .upDataTodo({ id, title, completed: !completed })
      .then(() => {
        setTodos(
          todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo,
          ),
        );
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(todoId => todoId !== id));
      });
  };

  const deleteTodo = (id: number) => {
    setLoadingTodoIds(prev => [...prev, id]);
    todoService
      .deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setError(true);
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(todoId => todoId !== id));
        focusInput();
      });
  };

  const closeErrorNotification = () => {
    setError(false);
  };

  const clearCompleated = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.all(
      completedTodos.map(todo => {
        setLoadingTodoIds(prev => [...prev, todo.id]);

        return todoService
          .deleteTodo(todo.id)
          .then(() => {
            setTodos(currentTodos =>
              currentTodos.filter(t => t.id !== todo.id),
            );
          })
          .catch(() => {
            setErrorMessage('Unable to delete a todo');
            setError(true);
          })
          .finally(() => {
            setLoadingTodoIds(prev =>
              prev.filter(todoId => todoId !== todo.id),
            );
          });
      }),
    ).finally(() => {
      focusInput();
    });
  };

  const updateTodo = (todo: Todo) => {
    // eslint-disable-next-line no-console
    console.log(todo);
    setShowUpdateInput(true);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${allCompleted && 'active'}`}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              ref={focusRef}
              onFocus={focusInput}
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              disabled={disable}
              onChange={e => setTitle(e.target.value)}
            />
          </form>
        </header>
        <section className="todoapp__main" data-cy="TodoList">
          {filterTodos.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={`todo ${todo.completed ? 'completed' : ''}`}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() => handleComplitedToDo(todo)}
                />
              </label>

              {!showUpdateInput ? (
                <>
                  <div
                    data-cy="TodoLoader"
                    className={`modal overlay ${loadingTodoIds.includes(todo.id) && 'is-active'}`}
                  >
                    <div
                      className="modal-background
                    has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>

                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => updateTodo(todo)}
                  >
                    {todo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    ×
                  </button>
                </>
              ) : (
                <>
                  <form>
                    <input
                      data-cy="TodoTitleField"
                      type="text"
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                      value="Todo is being edited now"
                    />
                  </form>
                </>
              )}

              {loading && (
                <div data-cy="TodoLoader" className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              )}
            </div>
          ))}
          {tempTodo && (
            <div
              key={tempTodo.id}
              data-cy="Todo"
              className={`todo ${tempTodo.completed ? 'completed' : ''}`}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={tempTodo.completed}
                  onChange={() => handleComplitedToDo(tempTodo)}
                />
              </label>
              <div
                data-cy="TodoLoader"
                className={`modal overlay is-active ${loadingTodoIds.includes(tempTodo.id) && 'is-active'}`}
              >
                <div
                  className="modal-background
                    has-background-white-ter"
                />
                <div className="loader" />
              </div>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deleteTodo(tempTodo.id)}
              >
                ×
              </button>
            </div>
          )}
        </section>

        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === FilterType.all ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setFilter(FilterType.all)}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filter === FilterType.active ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => setFilter(FilterType.active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filter === FilterType.completed ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter(FilterType.completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!todos.some(todo => todo.completed)}
              onClick={clearCompleated}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={closeErrorNotification}
        />

        {errorMessage}
      </div>
    </div>
  );
};
