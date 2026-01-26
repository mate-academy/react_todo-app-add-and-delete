/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';

type TodosError =
  | 'Unable to load todos'
  | 'Title should not be empty'
  | 'Unable to add a todo'
  | 'Unable to delete a todo'
  | 'Unable to update a todo'
  | null;

type Filter = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isEdited, setIsEdited] = useState(0);
  const [error, setErrorMessage] = useState<TodosError>('Unable to load todos');
  const [filter, setFilter] = useState<Filter>('all');
  const [isLoaded, setIsLoaded] = useState<number[] | null>(null);
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchTodos = async () => {
    getTodos()
      .then(data => {
        setTodosFromServer(data);
        setTodos(data);
      })
      .catch(() => setErrorMessage('Unable to load todos'));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setErrorMessage(null), 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (!isCreating) {
      inputRef.current?.focus();
    }
  }, [isCreating]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleFilter = (filterBy: Filter) => {
    setFilter(filterBy);

    switch (filterBy) {
      case 'active':
        setTodos([...todosFromServer].filter(todo => !todo.completed));
        break;

      case 'completed':
        setTodos([...todosFromServer].filter(todo => todo.completed));
        break;

      default:
        setTodos(todosFromServer);
        break;
    }
  };

  const handleCreate = async () => {
    if (title.trim().length === 0) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsCreating(true);

    const newTodo: Todo = {
      id: -1,
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTodos([...todos, newTodo]);

    try {
      const response = await client.post<Todo>('/todos', {
        title: title.trim(),
        completed: false,
        userId: USER_ID,
      });

      setTodosFromServer(prev => [
        ...prev,
        {
          id: response.id,
          title: response.title,
          userId: response.userId,
          completed: response.completed,
        },
      ]);
    } catch {
      setErrorMessage('Unable to add a todo');
      setTodos([...todos].filter(todo => todo.id !== newTodo.id));
    } finally {
      setTitle('');
      setIsCreating(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={
              todos !== null && todos.every(todo => todo.completed)
                ? 'todoapp__toggle-all active'
                : 'todoapp__toggle-all'
            }
            data-cy="ToggleAllButton"
          />

          <form
            onSubmit={e => {
              e.preventDefault();
              handleCreate();
            }}
          >
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={isCreating}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {todos &&
            todos.map(todo => (
              <div
                data-cy="Todo"
                className={todo.completed ? 'todo completed' : 'todo'}
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
                {isEdited === todo.id ? (
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      setIsEdited(0);
                    }}
                  >
                    <input
                      data-cy="TodoTitleField"
                      type="text"
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                      value={todo.title}
                    />
                  </form>
                ) : (
                  <>
                    <span
                      data-cy="TodoTitle"
                      className="todo__title"
                      onDoubleClick={() => setIsEdited(todo.id)}
                    >
                      {todo.title}
                    </span>

                    <button
                      type="button"
                      className="todo__remove"
                      data-cy="TodoDelete"
                      onClick={async () => {
                        setIsLoaded([todo.id]);
                        try {
                          await client.delete(`/todos/${todo.id}`);
                          setIsLoaded(null);
                        } catch {
                          setErrorMessage('Unable to delete a todo');
                        } finally {
                          setIsLoaded(null);
                          fetchTodos();
                        }
                      }}
                    >
                      ×
                    </button>
                  </>
                )}

                <div
                  data-cy="TodoLoader"
                  className={
                    isLoaded?.includes(todo.id) ||
                    (isCreating && todo.id === todos[todos.length - 1].id)
                      ? 'modal overlay is-active'
                      : 'modal overlay'
                  }
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}
        </section>

        {todosFromServer.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {[...todosFromServer].filter(todo => !todo.completed).length}{' '}
              items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={
                  filter === 'all' ? 'filter__link selected' : 'filter__link'
                }
                data-cy="FilterLinkAll"
                onClick={() => handleFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={
                  filter === 'active' ? 'filter__link selected' : 'filter__link'
                }
                data-cy="FilterLinkActive"
                onClick={() => handleFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={
                  filter === 'completed'
                    ? 'filter__link selected'
                    : 'filter__link'
                }
                data-cy="FilterLinkCompleted"
                onClick={() => handleFilter('completed')}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={async () => {
                const temp = todosFromServer.filter(todo => todo.completed);
                const result = temp.map(todo => todo.id);

                setIsLoaded(result);
                try {
                  for (let i = 0; i < result.length; i++) {
                    await client.delete(`/todos/${result[i]}`);
                  }

                  setIsLoaded(null);
                } catch {
                  setErrorMessage('Unable to delete a todo');
                } finally {
                  setIsLoaded(null);
                  fetchTodos();
                }
              }}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={
          error === null
            ? 'notification is-danger is-light has-text-weight-normal hidden'
            : 'notification is-danger is-light has-text-weight-normal'
        }
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {error === 'Unable to load todos' && 'Unable to load todos'}
        {error === 'Title should not be empty' && 'Title should not be empty'}
        {error === 'Unable to add a todo' && 'Unable to add a todo'}
        {error === 'Unable to delete a todo' && 'Unable to delete a todo'}
        {error === 'Unable to update a todo' && 'Unable to update a todo'}
      </div>
    </div>
  );
};
