/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import * as todoService from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';

type Filter = 'All' | 'Active' | 'Completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  // for showing loading overlay while adding todo
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  // for redacting todo (probably won't need it in future)
  const [selectedTodo] = useState<Todo | null>(null);
  // for input disabling
  const [isTodoLoading, setIsTodoLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  //#region effects
  // hide error message in 3 secs
  useEffect(() => {
    if (errorMessage.length !== 0) {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);

  // load todos 1 time on page loading
  useEffect(() => {
    setIsTodoLoading(true);
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(`Unable to load todos`))
      .finally(() => setIsTodoLoading(false));
  }, []);
  //#endregion

  //#region filter Todos
  const [selectedFilter, setSelectedFilter] = useState<Filter>('All');

  function getVisibleTodos() {
    let visibleTodos: Todo[];

    switch (selectedFilter) {
      case 'All':
        visibleTodos = todos;
        break;
      case 'Active':
        visibleTodos = todos.filter(todo => !todo.completed);
        break;
      case 'Completed':
        visibleTodos = todos.filter(todo => todo.completed);
        break;
    }

    return visibleTodos;
  }

  function handleFilterAll() {
    setSelectedFilter('All');
  }

  function handleFilterActive() {
    setSelectedFilter('Active');
  }

  function handleFilterCompleted() {
    setSelectedFilter('Completed');
  }
  //#endregion

  //#region focus change
  // I want focus to jump again on input after adding or deleting todo
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, [todos, isTodoLoading, tempTodo]);
  //#endregion

  //#region add Todos
  // input
  const [query, setQuery] = useState('');

  function addTodo({ title, completed, userId }: Omit<Todo, 'id'>) {
    setErrorMessage('');
    setIsTodoLoading(true);
    // while real todo loading, this temporal todo takes it's place and shows loading animation
    setTempTodo({
      id: 0,
      userId: todoService.USER_ID,
      title: query.trim(),
      completed: false,
    });

    return todoService
      .addTodo({ title, completed, userId })
      .then(newTodo => {
        // TS thinks that newTodo should have array type for some reason
        setTodos(currTodos => [...currTodos, newTodo]);
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');
        titleRef.current?.focus();
        throw error;
      })
      .finally(() => {
        setIsTodoLoading(false);
        setTempTodo(null);
      });
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();

    if (!query.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: query.trim(),
      completed: false,
      userId: todoService.USER_ID,
    };

    addTodo(newTodo).then(() => setQuery(''));
  }
  //#endregion

  //#region delete Todos and clear completed todos
  // for showing loading overlay while deleting todo
  const [loadingTodoId, setLoadingTodoId] = useState(0);

  function deleteTodos(todoId: Todo['id']) {
    setLoadingTodoId(todoId);
    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currTodos => currTodos.filter(todo => todo.id !== todoId));
      })
      .catch(error => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setLoadingTodoId(0);
      });
  }

  const completedTodosID = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  function handleClearCompleted() {
    completedTodosID.forEach(id =>
      todoService
        .deleteTodo(id)
        .then(() => {
          setTodos(currTodos => currTodos.filter(tod => !tod.completed));
        })
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
        }),
    );
  }
  //#endregion

  //#region user warning
  if (!todoService.USER_ID) {
    return <UserWarning />;
  }
  //#endregion

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length !== 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                // only if all todos completed
                active: todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              ref={titleRef}
              data-cy="NewTodoField"
              value={query}
              onChange={e => setQuery(e.target.value)}
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              // disabled on adding or deleting todo
              disabled={isTodoLoading || loadingTodoId !== 0}
            />
          </form>
        </header>

        {todos.length !== 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {getVisibleTodos().map(todo => (
              <div
                data-cy="Todo"
                className={cn('todo', {
                  completed: todo.completed,
                })}
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

                {selectedTodo ? (
                  <form>
                    <input
                      data-cy="TodoTitleField"
                      type="text"
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                      value="Todo is being edited now"
                    />
                  </form>
                ) : (
                  <>
                    <span data-cy="TodoTitle" className="todo__title">
                      {todo.title}
                    </span>
                    {/* already shown only on hover */}
                    <button
                      type="button"
                      className="todo__remove"
                      data-cy="TodoDelete"
                      onClick={() => deleteTodos(todo.id)}
                    >
                      ×
                    </button>
                  </>
                )}

                <div
                  data-cy="TodoLoader"
                  className={cn('modal overlay', {
                    // overlay is shown upon deleting todo
                    'is-active': loadingTodoId === todo.id,
                  })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}

            {/* temp todo shown only after sending request before real todo loads */}
            {tempTodo && (
              <div data-cy="Todo" className="todo">
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                  />
                </label>

                <>
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
                </>

                <div data-cy="TodoLoader" className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            )}
          </section>
        )}

        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            {/* Active link have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: selectedFilter === 'All',
                })}
                data-cy="FilterLinkAll"
                onClick={handleFilterAll}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: selectedFilter === 'Active',
                })}
                data-cy="FilterLinkActive"
                onClick={handleFilterActive}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: selectedFilter === 'Completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={handleFilterCompleted}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              // if all todos not completed the button isn't shown
              disabled={todos.every(todo => !todo.completed)}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {/* show only one message at a time */}
        {errorMessage}
        {/*
        Unable to update a todo */}
      </div>
    </div>
  );
};
