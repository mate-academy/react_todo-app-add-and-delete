/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import cn from 'classnames';

import { UserWarning } from './UserWarning';
import { FilterBy, Todo } from './types/Todo';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { wait } from './utils/fetchClient';
import { filterTodos } from './services/todos';

const USER_ID = 11144;

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.ALL);
  const [isAllCompleted, setIsAllCompleted] = useState(false);
  const [isSomeCompleted, setIsSomeCompleted] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  let preparedTodos = filterTodos(todos, filterBy);

  function showNotificationBlock() {
    setIsNotificationOpen(true);

    wait(3000)
      .then(() => {
        setIsNotificationOpen(false);
        setErrorMessage('');
      });
  }

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Can not load data');
        showNotificationBlock();
      });
  }, []);

  useEffect(() => {
    preparedTodos = filterTodos(todos, filterBy);
  }, [todos, filterBy]);

  useEffect(() => {
    const isSomeTodosCompleted = todos.some(todo => todo.completed);
    const isAllTodosCompleted = todos.every(todo => todo.completed);

    setIsSomeCompleted(isSomeTodosCompleted);
    setIsAllCompleted(isAllTodosCompleted);
  }, [todos]);

  const countActiveTodos = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const onAddNewTodo = (event: FormEvent) => {
    event.preventDefault();
    const normalizedQuery = newTodoTitle.trim();

    if (!normalizedQuery) {
      setErrorMessage('Title can\'t be empty');
      showNotificationBlock();

      return 0;
    }

    setLoading(true);

    const createdTodo = {
      id: 0,
      completed: false,
      title: normalizedQuery,
      userId: USER_ID,
    };

    setTempTodo(() => createdTodo);

    createTodo(createdTodo)
      .then((newTodo) => {
        setNewTodoTitle('');
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        showNotificationBlock();
        setTempTodo(null);
        throw new Error('Unable to add a todo');
      })
      .finally(() => setLoading(false));

    return 0;
  };

  const onDeleteTodo = (deletedTodo: Todo) => {
    setLoading(true);
    setSelectedTodo(deletedTodo);

    deleteTodo(deletedTodo.id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(
          todo => todo.id !== deletedTodo.id,
        ));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        showNotificationBlock();
        throw new Error('Unable to delete a todo');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onDeleteCompletedTodos = () => {
    const promises = todos.filter(todo => todo.completed)
      .map(todo => onDeleteTodo(todo));

    Promise.all(promises)
      .catch(() => {
        setErrorMessage('Unable to delete completed todos');
        showNotificationBlock();
        throw new Error('Unable to delete completed todos');
      });
  };

  if (!USER_ID) {
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
              className={cn('todoapp__toggle-all', {
                active: isAllCompleted,
              })}
            />
          )}

          <form onSubmit={onAddNewTodo}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={event => setNewTodoTitle(event.target.value)}
              disabled={loading}
            />
          </form>
        </header>
        {todos.length > 0 && (
          <>
            <section
              className={cn('todoapp__main', {
                hidden: preparedTodos.length === 0,
              })}
            >
              {preparedTodos.length > 0 && preparedTodos.map(todo => (
                <div
                  className={cn('todo', {
                    completed: todo.completed,
                  })}
                  key={todo.id}
                >
                  <label className="todo__status-label">
                    <input
                      type="checkbox"
                      className="todo__status"
                      checked={todo.completed}
                      onChange={() => {}}
                    />
                  </label>

                  {isEditing && selectedTodo?.id === todo.id ? (
                    <form>
                      <input
                        type="text"
                        className="todo__title-field"
                        placeholder="Empty todo will be deleted"
                        value="Todo is being edited now"
                      />
                    </form>
                  ) : (
                    <>
                      <span
                        className="todo__title"
                        onDoubleClick={() => {
                          setSelectedTodo(todo);
                          setIsEditing(true);
                        }}
                      >
                        {todo.title}
                      </span>

                      <button
                        type="button"
                        className="todo__remove"
                        onClick={() => onDeleteTodo(todo)}
                      >
                        ×
                      </button>
                    </>
                  )}

                  {loading && selectedTodo?.id === todo.id && (
                    <div
                      className={cn('modal overlay', {
                        'is-active': loading,
                      })}
                    >
                      <div
                        className="modal-background has-background-white-ter"
                      />
                      <div className="loader" />
                    </div>
                  )}
                </div>
              ))}

              {tempTodo && (
                <div
                  className="todo"
                >
                  <label className="todo__status-label">
                    <input
                      type="checkbox"
                      className="todo__status"
                    />
                  </label>

                  <span
                    className="todo__title"
                  >
                    {tempTodo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                  >
                    ×
                  </button>

                  {loading && (
                    <div
                      className={cn('modal overlay', {
                        'is-active': loading,
                      })}
                    >
                      <div
                        className="modal-background has-background-white-ter"
                      />
                      <div className="loader" />
                    </div>
                  )}
                </div>
              )}
            </section>

            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${countActiveTodos} items left`}
              </span>

              <nav className="filter">
                <a
                  href="#/"
                  className={cn('filter__link', {
                    selected: filterBy === FilterBy.ALL,
                  })}
                  onClick={() => setFilterBy(FilterBy.ALL)}
                >
                  All
                </a>

                <a
                  href="#/"
                  className={cn('filter__link', {
                    selected: filterBy === FilterBy.ACTIVE,
                  })}
                  onClick={() => setFilterBy(FilterBy.ACTIVE)}
                >
                  Active
                </a>

                <a
                  href="#/"
                  className={cn('filter__link', {
                    selected: filterBy === FilterBy.COMPLETED,
                  })}
                  onClick={() => setFilterBy(FilterBy.COMPLETED)}
                >
                  Completed
                </a>
              </nav>

              <button
                type="button"
                className="todoapp__clear-completed"
                disabled={!isSomeCompleted}
                onClick={onDeleteCompletedTodos}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <div
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !isNotificationOpen,
          },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setIsNotificationOpen(false)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
