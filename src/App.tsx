/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import * as todosService from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { Filter } from './types/Filter';
import classNames from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';


export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [value, setValue] = useState('');
  const [editing, setEditing] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [isAddind, setIsAdding] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = (todoId: number) => {
    return loadingTodoIds.includes(todoId);
  };

  const showErrorMessage = (error: ErrorMessage) => {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  useEffect(() => {
    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => showErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!isAddind) {
      inputRef.current?.focus();
    }
  }, [isAddind]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!value.trim()) {
      showErrorMessage('Title should not be empty');

      return;
    }

    setIsAdding(true);

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: value.trim(),
      completed: false,
    };

    setTempTodo(newTempTodo);
    setLoadingTodoIds([0]);

    todosService
      .createTodo({
        userId: USER_ID,
        title: newTempTodo.title,
        completed: false,
      })
      .then(createdTodo => {
        setTodos(prev => [...prev, createdTodo]);
        setTempTodo(null);
        setValue('');
      })
      .catch(() => {
        setTempTodo(null);
        showErrorMessage('Unable to add a todo');
        setValue(newTempTodo.title);
      })
      .finally(() => {
        setLoadingTodoIds([]);
        setIsAdding(false);
        setTimeout(() => inputRef.current?.focus(), 0);
      });
  };

  const removeTodo = (todoId: number) => {
    setLoadingTodoIds([todoId]);

    todosService
      .removeTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(prev => prev.id !== todoId));
      })
      .catch(() => {
        showErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingTodoIds([]);
        inputRef.current?.focus();
      });
  };

  const handleUpdate = (
    event: React.FormEvent<HTMLFormElement>,
    id: number,
  ) => {
    event.preventDefault();

    if (!newTitle) {
      removeTodo(id);

      return;
    }

    setTodos(prevTodos =>
      prevTodos.map(prev =>
        prev.id === id ? { ...prev, title: newTitle } : prev,
      ),
    );

    setEditing(null);
  };

  const toggleCompleted = (id: number, checked: boolean) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: checked } : todo,
      ),
    );
  };

  const changeFilter = (newFilter: Filter) => {
    setFilter(newFilter);
  };

  const completedTodos = todos.filter(todo => todo.completed);

  const clearCompletedTodo = () => {
    setLoadingTodoIds(completedTodos.map(todo => todo.id));

    Promise.allSettled(
      completedTodos.map(todo => todosService.removeTodo(todo.id)),
    )
      .then(results => {
        const failedIds = completedTodos
          .filter((_, index) => results[index].status === 'rejected')
          .map(todo => todo.id);

        if (failedIds.length > 0) {
          showErrorMessage('Unable to delete a todo');
        }

        setTodos(prev =>
          prev.filter(todo => !todo.completed || failedIds.includes(todo.id)),
        );
      })
      .finally(() => {
        setLoadingTodoIds([]);
        inputRef.current?.focus();
      });
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

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={value}
              onChange={event => setValue(event.target.value)}
              disabled={isAddind}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {visibleTodos.map(todo => (
              <CSSTransition key={todo.id} timeout={300} classNames="item">
                <div
                  data-cy="Todo"
                  className={classNames('todo', { completed: todo.completed })}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={todo.completed}
                      onChange={event =>
                        toggleCompleted(todo.id, event.target.checked)
                      }
                    />
                  </label>

                  {editing === todo.id ? (
                    <form onSubmit={event => handleUpdate(event, todo.id)}>
                      <input
                        data-cy="TodoTitleField"
                        type="text"
                        className="todo__title-field"
                        placeholder="Empty todo will be deleted"
                        value={newTitle}
                        onChange={event => setNewTitle(event?.target.value)}
                      />
                    </form>
                  ) : (
                    <span
                      data-cy="TodoTitle"
                      className="todo__title"
                      onDoubleClick={() => {
                        setEditing(todo.id);
                        setNewTitle(todo.title);
                      }}
                    >
                      {todo.title}
                    </span>
                  )}

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => removeTodo(todo.id)}
                    disabled={isLoading(todo.id)}
                  >
                    ×
                  </button>

                  <div
                    data-cy="TodoLoader"
                    className={classNames('modal overlay', {
                      'is-active': isLoading(todo.id),
                    })}
                  >
                    {/* eslint-disable-next-line max-len */}
                    <div className="modal-background has-background-white-ter " />
                    <div className="loader" />
                  </div>
                </div>
              </CSSTransition>
            ))}

            {tempTodo && (
              <CSSTransition key={0} timeout={300} classNames="temp-item">
                <div data-cy="Todo" className="todo">
                  <label className="todo__status-label">
                    <input type="checkbox" className="todo__status" disabled />
                  </label>
                  <span data-cy="TodoTitle" className="todo__title">
                    {tempTodo.title}
                  </span>
                  <button type="button" className="todo__remove" disabled>
                    ×
                  </button>
                  <div data-cy="TodoLoader" className="modal overlay is-active">
                    {/* eslint-disable-next-line max-len */}
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                </div>
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                onClick={() => changeFilter(Filter.All)}
                className={classNames('filter__link', {
                  selected: filter === 'all',
                })}
                data-cy="FilterLinkAll"
              >
                All
              </a>

              <a
                href="#/active"
                onClick={() => changeFilter(Filter.Active)}
                className={classNames('filter__link', {
                  selected: filter === 'active',
                })}
                data-cy="FilterLinkActive"
              >
                Active
              </a>

              <a
                href="#/completed"
                onClick={() => changeFilter(Filter.Completed)}
                className={classNames('filter__link', {
                  selected: filter === 'completed',
                })}
                data-cy="FilterLinkCompleted"
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={() => clearCompletedTodo()}
              disabled={completedTodos.length === 0}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: errorMessage === null },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage}
      </div>
    </div>
  );
};
