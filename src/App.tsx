/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const FILTERS = { all: 'all', completed: 'completed', active: 'active' };

  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [filteredTodo, setFilteredTodo] = React.useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = React.useState('');
  const [filter, setFilter] = React.useState(FILTERS.all);
  const [todoActiveCount, setTodoActiveCount] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isErrorVisible, setIsErrorVisible] = React.useState(false);

  const showError = (message: string) => {
    setErrorMessage(message);
    setIsErrorVisible(true);

    setTimeout(() => {
      setIsErrorVisible(false);
    }, 3000);
  };

  const clearError = () => {
    setErrorMessage('');
    setIsErrorVisible(false);
  };

  const countActiveTodos = () => {
    const activeTodos = todos.filter(todo => !todo.completed);

    setTodoActiveCount(activeTodos.length);
  };

  const editTodo = (todoId: number, data: Partial<Todo>) => {
    clearError();

    updateTodo(todoId, data)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
          ),
        );
      })
      .catch(() => {
        showError('Unable to update a todo');
      });
  };

  const removeTodo = (todoId: number) => {
    clearError();

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        showError('Unable to delete a todo');
      });
  };

  const removeCompletedTodos = () => {
    clearError();

    const completedTodos = todos.filter(todo => todo.completed);
    const deletePromises = completedTodos.map(todo => deleteTodo(todo.id));

    Promise.all(deletePromises)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
      })
      .catch(() => {
        showError('Unable to delete completed todos');
      });
  };

  const submitTodo = () => {
    if (todoTitle.trim() === '') {
      // Handle empty title case
      showError('Title should not be empty');

      return;
    }

    clearError();

    const newTodo: Todo = {
      userId: USER_ID,
      id: 0,
      title: todoTitle,
      completed: false,
    };

    addTodo(newTodo)
      .then(() => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTodoTitle(''); // Clear the input field after successful submission
      })
      .catch(() => {
        showError('Unable to add a todo');
      });
  };

  const filterTodos = () => {
    const t = todos.filter(todo => {
      if (filter === FILTERS.active) {
        return !todo.completed;
      }

      if (filter === FILTERS.completed) {
        return todo.completed;
      }

      if (filter === FILTERS.all) {
        return todo;
      }
    });

    setFilteredTodo(t);
  };

  useEffect(() => {
    // Fetch todos when the component mounts
    getTodos()
      .then(t => {
        // Handle the fetched todos
        setTodos(t);
      })
      .catch(() => {
        // Handle any errors that occur during the fetch
        showError('Unable to load todos');
      });
    filterTodos();
  }, []);

  useEffect(() => {
    countActiveTodos();
    filterTodos();
  }, [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

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

          {/* Add a todo on form submit */}
          {todos.length === 0 && (
            <form
              onSubmit={e => {
                e.preventDefault();
                submitTodo();
                countActiveTodos();
              }}
            >
              <input
                data-cy="NewTodoField"
                type="text"
                className="todoapp__new-todo"
                placeholder="What needs to be done?"
                value={todoTitle}
                onChange={e => setTodoTitle(e.target.value)}
              />
            </form>
          )}
        </header>

        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodo.map(todo => (
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
                    onChange={() => {
                      editTodo(todo.id, { completed: !todo.completed });
                      countActiveTodos();
                    }}
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
                  onClick={() => {
                    removeTodo(todo.id);
                    countActiveTodos();
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </section>
        )}

        {/* Hide the footer if there are no todos */}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todoActiveCount} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={
                  filter === FILTERS.all
                    ? 'filter__link selected'
                    : 'filter__link'
                }
                data-cy="FilterLinkAll"
                onClick={() => {
                  setFilter(FILTERS.all);
                  filterTodos();
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={
                  filter === FILTERS.active
                    ? 'filter__link selected'
                    : 'filter__link'
                }
                data-cy="FilterLinkActive"
                onClick={() => {
                  setFilter(FILTERS.active);
                  filterTodos();
                }}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={
                  filter === FILTERS.completed
                    ? 'filter__link selected'
                    : 'filter__link'
                }
                data-cy="FilterLinkCompleted"
                onClick={() => {
                  setFilter('completed');
                  filterTodos();
                }}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={removeCompletedTodos}
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
        className={
          isErrorVisible
            ? 'notification is-danger is-light has-text-weight-normal'
            : 'notification is-danger is-light has-text-weight-normal hidden'
        }
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={clearError}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
