/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, postTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/Filter';

const USER_ID = 6701;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterType>(FilterType.All);
  const [loadingError, setLoadingError] = useState(false);
  const [postError, setPostError] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [emptyTitleError, setEmptyTitleError] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleting, setDeleting] = useState(0);
  const error = useMemo(() => (
    loadingError || postError || emptyTitleError || deleteError
  ), [loadingError, postError, emptyTitleError, deleteError]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(res => {
        setTodos(res);
        // console.log(res);
      })
      .catch(() => {
        setLoadingError(true);
        setTodos([]);
      });
  }, []);

  const addTodo = (title:string) => {
    if (!title) {
      setEmptyTitleError(true);

      return;
    }

    const newTodo = {
      title,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    postTodo(newTodo)
      .then(res => {
        setTodos(oldTodos => ([...oldTodos, res]));
      })
      .catch(() => {
        setPostError(true);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const filterTodos = (filter: FilterType) => {
    switch (filter) {
      case FilterType.Active:
        return (todos.filter(todo => !todo.completed));

      case FilterType.Completed:
        return (todos.filter(todo => todo.completed));

      default:
        return [...todos];
    }
  };

  const visibleTodos:Todo[] = useMemo(
    () => filterTodos(statusFilter), [statusFilter, todos],
  );

  const clickFilterHandler = (filter: FilterType) => {
    setStatusFilter(filter);
  };

  const deleteNotificationHandler = () => {
    setLoadingError(false);
    setPostError(false);
    setEmptyTitleError(false);
  };

  const numActiveTodos = filterTodos(FilterType.Active).length;
  const numCompletedTodos = filterTodos(FilterType.Completed).length;

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(input);
    setInput('');
  };

  const deleteHandler = (todoId: number) => {
    setIsLoading(true);
    setDeleting(todoId);
    deleteTodo(todoId)
      .then(() => {
        setTodos(oldTodos => (
          oldTodos.filter(todo => todo.id !== todoId)
        ));
      })
      .catch(() => {
        setDeleteError(true);
      })
      .finally(() => {
        setIsLoading(false);
        setDeleting(0);
      });
  };

  const clearCompletedHandler = () => {
    todos.map(todo => {
      if (todo.completed) {
        deleteHandler(todo.id);
      }

      return todo;
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
          <button type="button" className="todoapp__toggle-all active" />

          <form
            onSubmit={submitHandler}
          >
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={input}
              onChange={onChangeHandler}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {visibleTodos.map(todo => (
            <div
              className={todo.completed ? 'todo completed' : 'todo'}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                />
              </label>

              <span className="todo__title">{todo.title}</span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => deleteHandler(todo.id)}
              >
                ×
              </button>

              <div
                className={`modal overlay ${isLoading && deleting === todo.id && 'is-active'}`}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}

          {tempTodo && (
            <div className={tempTodo.completed ? 'todo completed' : 'todo'}>
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  checked={tempTodo.completed}
                />
              </label>

              <span className="todo__title">{tempTodo.title}</span>
              <button type="button" className="todo__remove">×</button>

              <div className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        <footer
          className="todoapp__footer"
          hidden={!todos}
        >
          <span className="todo-count">
            {`${numActiveTodos} items left`}
          </span>

          <nav className="filter">
            <a
              href="#/"
              className={`filter__link ${statusFilter === FilterType.All && 'selected'}`}
              onClick={() => clickFilterHandler(FilterType.All)}
            >
              All
            </a>

            <a
              href="#/active"
              className={`filter__link ${statusFilter === FilterType.Active && 'selected'}`}
              onClick={() => clickFilterHandler(FilterType.Active)}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={`filter__link ${statusFilter === FilterType.Completed && 'selected'}`}
              onClick={() => clickFilterHandler(FilterType.Completed)}
            >
              Completed
            </a>
          </nav>

          <button
            type="button"
            className="todoapp__clear-completed"
            onClick={clearCompletedHandler}
            disabled={!numCompletedTodos}
          >
            Clear completed
          </button>
        </footer>
      </div>

      <div
        className={`notification is-danger is-light has-text-weight-normal ${!error && 'hidden'}`}
      >
        <button
          type="button"
          className="delete"
          onClick={deleteNotificationHandler}
        />

        {loadingError && 'Unable to load a todo'}
        {postError && 'Unable to add a todo'}
        {emptyTitleError && 'Title can\'t be empty'}
        {deleteError && 'Unable to delete a todo'}
      </div>
    </div>
  );
};
