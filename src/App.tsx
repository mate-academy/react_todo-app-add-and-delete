/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [editingTodo, setEditingTodo] = useState(0);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDeleteTodo, setIsdeleteTodo] = useState(false);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const field = useRef<HTMLInputElement>(null);

  const handleError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    if (field.current) {
      field.current.disabled = true;
    }

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        handleError('Unable to load todos');
      })
      .finally(() => {
        if (field.current) {
          field.current.disabled = false;
          field.current.focus();
        }
      });
  }, []);

  useEffect(() => {
    if (field.current) {
      field.current.focus();
    }
  }, [editingTodo]);

  const visibleTodos = todos.filter(todo => {
    switch (status) {
      case TodoStatus.active:
        return !todo.completed;
      case TodoStatus.completed:
        return todo.completed;
      default:
        return todo;
    }
  });

  const activeItems = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const deleteTodo = (todoId: number) => {
    setIsdeleteTodo(true);

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        handleError('Unable to delete a todo');
      })
      .finally(() => {
        setIsdeleteTodo(false);
        if (field.current) {
          field.current.focus();
        }
      });
  };

  const handleCompleteDelete = () => {
    completedTodos.forEach(todo => deleteTodo(todo.id));
  };

  const addTodo = (title: string) => {
    const titleWithOutSpaces = title.trim();

    if (titleWithOutSpaces.length === 0) {
      handleError('Title should not be empty');

      return;
    }

    const currentTodo = {
      title: titleWithOutSpaces,
      userId: todoService.USER_ID,
      completed: false,
    };

    setTempTodo({
      id: 0,
      title: 'Test Todo',
      userId: todoService.USER_ID,
      completed: false,
    });

    if (field.current) {
      field.current.disabled = true;
    }

    todoService
      .createTodo(currentTodo)
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTempTodo(null);
        setTodoTitle('');
      })
      .catch(() => {
        handleError('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => {
        setTimeout(() => {
          if (field.current) {
            field.current.disabled = false;
            field.current.focus();
          }
        }, 100);
      });
  };

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
          <form
            onSubmit={e => {
              e.preventDefault();
              addTodo(todoTitle);
            }}
          >
            <input
              ref={field}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={e => setTodoTitle(e.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <div
              data-cy="Todo"
              className={`todo ${todo.completed ? 'completed' : ''}`}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                />
              </label>

              {editingTodo === todo.id ? (
                <form>
                  <input
                    ref={field}
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={todo.title}
                    onBlur={() => setEditingTodo(0)}
                  />
                </form>
              ) : (
                <>
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => setEditingTodo(todo.id)}
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

                  {/* overlay will cover the todo while it is being deleted or updated */}
                  <div
                    data-cy="TodoLoader"
                    className={`modal overlay ${isDeleteTodo && 'is-active'}`}
                  >
                    <div
                      className="
                      modal-background
                      has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                </>
              )}
            </div>
          ))}

          {tempTodo && (
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={tempTodo.completed}
                />
              </label>

              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => setEditingTodo(tempTodo.id)}
                >
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

                {/* overlay will cover the todo while it is being deleted or updated */}
                <div data-cy="TodoLoader" className="modal overlay is-active">
                  <div
                    className="
                    modal-background
                    has-background-white-ter"
                  />
                  <div className="loader" />
                </div>
              </>
            </div>
          )}
        </section>

        {todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeItems.length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${status === 'all' && 'selected'}`}
                data-cy="FilterLinkAll"
                onClick={() => setStatus(TodoStatus.all)}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${status === 'active' && 'selected'}`}
                data-cy="FilterLinkActive"
                onClick={() => setStatus(TodoStatus.active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${status === 'completed' && 'selected'}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setStatus(TodoStatus.completed)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedTodos.length === 0}
              onClick={handleCompleteDelete}
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
        className={`
        notification
        is-danger
        is-light
        has-text-weight-normal
        ${!errorMessage ? 'hidden' : ''}
        `}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
        <br />
      </div>
    </div>
  );
};
