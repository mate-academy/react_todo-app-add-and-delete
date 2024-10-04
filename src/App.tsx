/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';

const TempTodoItem: React.FC<{ todo: Todo; loader: boolean }> = ({
  todo,
  loader,
}) => (
  <div className={`todo ${todo.completed ? 'completed' : ''}`}>
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        readOnly
      />
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {todo.title}
    </span>

    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      disabled
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={`modal overlay ${loader ? 'is-active' : ''}`}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletedTodoId, setDeletedTodoId] = useState<number | null>(null);
  const [titleNewTodo, setTitleNewTodo] = useState<string>('');
  const [loader, setLoader] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('all');
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const deleteError = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
        deleteError();
      });
  }, []);

  function addTodo({ title, completed, userId }: Omit<Todo, 'id'>) {
    if (title.trim() === '') {
      setErrorMessage('Title should not be empty');
      deleteError();

      return;
    }

    setLoader(true);

    const newTempTodo: Todo = { id: 0, title, completed, userId };

    setTempTodo(newTempTodo);

    todoService
      .createTodo({ title, completed, userId })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitleNewTodo('');
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        deleteError();
      })
      .finally(() => {
        setLoader(false);
        inputRef.current?.focus();
      });
  }

  function deleteTodo(todoId: number) {
    const todoToDelete = todos.find(todo => todo.id === todoId);

    if (!todoToDelete) {
      return;
    }

    setTempTodo(todoToDelete);
    setDeletedTodoId(todoId);
    setLoader(true);

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setTempTodo(null);
        setDeletedTodoId(null);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        deleteError();
        setTempTodo(null);
      })
      .finally(() => {
        setLoader(false);
        inputRef.current?.focus();
      });
  }

  function deleteCompletedTodos() {
    const completedTodos = todos.filter(todo => todo.completed);

    setLoader(true);
    Promise.all(completedTodos.map(todo => todoService.deleteTodo(todo.id)))
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => !todo.completed));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        deleteError();
      })
      .finally(() => {
        setLoader(false);
        inputRef.current?.focus();
      });
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleNewTodo(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addTodo({
      title: titleNewTodo,
      completed: false,
      userId: todoService.USER_ID,
    });
  };

  const filteredTodos = todos
    .filter(todo => {
      if (filter === 'active') {
        return !todo.completed;
      }

      if (filter === 'completed') {
        return todo.completed;
      }

      return true;
    })
    .filter(todo => !(tempTodo && tempTodo.id === todo.id));

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
              data-cy="ToggleAllButton"
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              autoFocus
              onChange={handleTitleChange}
              value={titleNewTodo}
              readOnly={loader}
            />
          </form>
        </header>

        {filteredTodos.map(todo => (
          <section className="todoapp__main" data-cy="TodoList" key={todo.id}>
            <div
              data-cy="Todo"
              className={`todo ${todo.completed ? 'completed' : ''}`}
            >
              {2 === todo.id ? (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                  }}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={todo.completed}
                    />
                  </label>

                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Fmpty todo will be deleted"
                    value={todo.title}
                    onChange={handleTitleChange}
                  />
                </form>
              ) : (
                <>
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
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
                    onClick={() => deleteTodo(todo.id)}
                    disabled={loader}
                  >
                    ×
                  </button>
                </>
              )}
            </div>
          </section>
        ))}

        {tempTodo && deletedTodoId === null && (
          <section className="todoapp__main">
            <TempTodoItem todo={tempTodo} loader={loader} />
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todos.every(todo => !todo.completed)}
              onClick={deleteCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${errorMessage ? '' : 'hidden'}`}
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
