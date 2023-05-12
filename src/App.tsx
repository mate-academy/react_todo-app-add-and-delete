/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, deleteTodo } from './api/todos';
// eslint-disable-next-line import/extensions
import { Todo } from './types/Todo';

const USER_ID = 10305;

export const App: React.FC = () => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [isHovered, setIsHovered] = React.useState(false);
  const [filter, setFilter] = React.useState('all');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState<string>('');
  const [tempTodo, setTempTodo] = React.useState<Todo | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const activeTodos = todos.filter((todo) => !todo.completed);
  const comletedTodos = todos.filter((todo) => todo.completed);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (error) {
      timeout = setTimeout(() => setError(null), 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return todo;
    }
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('Title cannot be empty');

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTodo);

    if (tempTodo) {
      addTodo(tempTodo)
        .then((response) => {
          if (response instanceof Error) {
            setError(response.message);

            return;
          }

          setTodos([...todos, response]);
          setTitle('');
        })
        .catch(() => setError('Unable to add a todo'))
        .finally(() => {
          setTempTodo(null);
        });
    }

    setIsLoading(true);
  };

  const handleDelete = (id: number) => {
    setIsDeleting(true);

    deleteTodo(id)
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => setIsDeleting(false));
  };

  const hansleDeleteCompleted = () => {
    const completedIds = comletedTodos.map((todo) => todo.id);

    completedIds.forEach((id) => {
      setIsDeleting(true);

      deleteTodo(id)
        .then(() => {
          setTodos(todos.filter((todo) => todo.id !== id));
        })
        .catch(() => setError('Unable to delete a todo'))
        .finally(() => setIsDeleting(false));
    });
  };

  getTodos(USER_ID).then((response) => setTodos(response));

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button type="button" className="todoapp__toggle-all active" />

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              value={title}
              placeholder="What needs to be done?"
              onChange={(event) => setTitle(event.target.value)}
              onDoubleClick={() => setIsEditing(true)}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {filteredTodos.map((todo: Todo) => (
            <div
              className={classNames('todo', { completed: todo.completed })}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  value={todo.title}
                  checked={todo.completed}
                  onMouseOver={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                />
              </label>

              {isEditing ? (
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
                  <span className="todo__title">{todo.title}</span>

                  {isHovered && (
                    <>
                      <button
                        type="button"
                        className="todo__remove"
                        onClick={() => handleDelete(todo.id)}
                      >
                        ×
                      </button>

                      <div className={classNames('modal overlay',
                        { 'is-active': isDeleting || isLoading })}
                      >

                        <div className="modal-background has-background-white-ter" />
                        <div className="loader" />

                      </div>
                    </>
                  )}
                </>
              )}

              <div className={classNames('modal overlay',
                { 'is-active': !isLoading })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodos.length} items left`}
            </span>

            <nav className="filter">
              <a
                href="#/"
                className={classNames('filter__link',
                  { selected: filter === 'all' })}
                onClick={() => setFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link',
                  { selected: filter === 'active' })}
                onClick={() => setFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link',
                  { selected: filter === 'completed' })}
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </nav>

            {comletedTodos.length > 0 && (
              <button
                type="button"
                className="todoapp__clear-completed"
                onClick={() => hansleDeleteCompleted()}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      <div className={classNames(
        'notification isDanger is-light has-text-weight-normal',
        { hidden: error === null },
      )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />

        {error}
      </div>
    </div>
  );
};
