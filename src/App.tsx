/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';

enum Filters {
  all = 'All',
  completed = 'Completed',
  active = 'Active',
}

enum Errors {
  loadingTodos = 'Unable to load todos',
  emptyTitle = 'Title should not be empty',
  addingTodo = 'Unable to add a todo',
  deletingTodo = 'Unable to delete a todo',
  updatingTodo = 'Unable to update a todo',
}

export const App: React.FC = () => {
  const [prepariedTodos, setPrepariedTodos] = useState<Todo[]>([]);

  const [filterMethod, setFilterMethod] = useState(Filters.all);
  const [errorMessage, setErrorMessage] = useState('');

  const [todoTitle, setTodoTitle] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [TodoOnDeleting, setTodoOnDeleting] = useState<number | null>(null);
  const [TodosOnDeleting, setTodosOnDeleting] = useState<number[]>([]);

  const itemsLeft = prepariedTodos.filter(todo => todo.completed === false);

  useEffect(() => {
    titleRef.current?.focus();
    const loadingTodos = async () => {
      try {
        const todos = await getTodos();

        setPrepariedTodos(todos);
      } catch (err) {
        setErrorMessage(Errors.loadingTodos);
      }
    };

    loadingTodos();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const errorTimer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(errorTimer);
    }
  }, [errorMessage]);

  const getFilteredTodos = (todos: Todo[], query: string) => {
    let filteredTodos = [...todos];

    switch (query) {
      case Filters.active:
        filteredTodos = filteredTodos.filter(todo => todo.completed === false);
        break;
      case Filters.completed:
        filteredTodos = filteredTodos.filter(todo => todo.completed === true);
        break;
      default:
        break;
    }

    return filteredTodos;
  };

  const handledTodos = tempTodo
    ? [...prepariedTodos, tempTodo]
    : prepariedTodos;

  const filteredTodos = getFilteredTodos(handledTodos, filterMethod);

  const handleSettingTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleAddingNewTodo = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (todoTitle.trim() === '') {
      setErrorMessage(Errors.emptyTitle);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: todoTitle.trim(),
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      const todoResponse = await addTodo(newTodo);

      setPrepariedTodos(currentTodos => [...currentTodos, todoResponse]);

      setTodoTitle('');
    } catch (err) {
      setErrorMessage(Errors.addingTodo);
    } finally {
      setTempTodo(null);

      if (titleRef.current) {
        setTimeout(() => {
          titleRef.current?.focus();
        }, 0);
      }
    }
  };

  const handleDeletingTodo = async (id: number) => {
    try {
      setTodoOnDeleting(id);

      await deleteTodo(id);

      setPrepariedTodos(currentTodos =>
        currentTodos.filter(todo => todo.id !== id),
      );
    } catch (err) {
      setErrorMessage(Errors.deletingTodo);
    } finally {
      setTodoOnDeleting(null);

      if (titleRef.current) {
        setTimeout(() => {
          titleRef.current?.focus();
        }, 0);
      }
    }
  };

  const handleDeletingTodos = async () => {
    const completedTodos = prepariedTodos.filter(todo => todo.completed);
    const completedTodosIds = completedTodos.map(todo => todo.id);

    setTodosOnDeleting(currentIds => [...currentIds, ...completedTodosIds]);

    try {
      const results = await Promise.allSettled(
        completedTodosIds.map(todoId => deleteTodo(todoId)),
      );

      const successfulIds = completedTodos
        .filter((_todo, index) => results[index].status === 'fulfilled')
        .map(todo => todo.id);

      if (results.some(result => result.status === 'rejected')) {
        setErrorMessage(Errors.deletingTodo);
      }

      if (successfulIds.length > 0) {
        setPrepariedTodos(currentTodos =>
          currentTodos.filter(todo => !successfulIds.includes(todo.id)),
        );
      }
    } catch (err) {
      setErrorMessage(Errors.deletingTodo);
    } finally {
      setTodosOnDeleting(currentTodosIds =>
        currentTodosIds?.filter(id => !completedTodosIds.includes(id)),
      );

      if (titleRef.current) {
        setTimeout(() => {
          titleRef.current?.focus();
        }, 0);
      }
    }
  };

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
          <form onSubmit={handleAddingNewTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={handleSettingTitle}
              ref={titleRef}
              disabled={tempTodo !== null}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <div
              data-cy="Todo"
              key={todo.id}
              className={classNames('todo', { completed: todo.completed })}
            >
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
                onClick={() => handleDeletingTodo(todo.id)}
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being deleted or updated */}
              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active':
                    todo.id === 0 ||
                    todo.id === TodoOnDeleting ||
                    TodosOnDeleting.includes(todo.id),
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
          <>
            {/* This todo is an active todo
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              Not Completed Todo
            </span>
            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>

          This todo is being edited
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            This form is shown instead of the title and remove button
            <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value="Todo is being edited now"
              />
            </form>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>

          This todo is in loadind state
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              Todo is being saved now
            </span>

            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button>

            'is-active' class puts this modal on top of the todo
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}
          </>
        </section>

        {/* Hide the footer if there are no todos */}
        {prepariedTodos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${itemsLeft.length} items left`}
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filterMethod === Filters.all,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilterMethod(Filters.all)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filterMethod === Filters.active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilterMethod(Filters.active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filterMethod === Filters.completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilterMethod(Filters.completed)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleDeletingTodos}
              disabled={prepariedTodos.every(todo => !todo.completed)}
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
          { hidden: !errorMessage },
        )}
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
