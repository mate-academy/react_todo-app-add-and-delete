/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Errors } from './types/Errors';
import { Filter } from './types/Filter';
import classNames from 'classnames';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterBy, setFilterBy] = useState(Filter.all);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingCompleted, setDeletingCompleted] = useState(false);

  const newTodoInput = useRef<HTMLInputElement>(null);
  const errorMessageTimeout = useRef<number | null>(null);

  const visibleTodos = todos.filter(todo => {
    switch (filterBy) {
      case Filter.active:
        return !todo.completed;
      case Filter.completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const todosCounter = todos.filter(todo => !todo.completed).length;

  const hasAnyCompletedTodos = todos.some(todo => todo.completed);

  const focusNewTodoInput = () => {
    if (newTodoInput.current) {
      newTodoInput.current.focus();
    }
  };

  const handleNewTodoFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isSending) {
      return;
    }

    const newTitle = newTodoTitle.trim();

    if (!newTitle) {
      setErrorMessage(Errors.emptyTitle);

      return;
    }

    setIsSending(true);

    const newTodo = {
      title: newTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    try {
      const createdTodo = await addTodo(newTodo).then(response => response);

      setTodos([...todos, createdTodo]);
      setNewTodoTitle('');
    } catch (error) {
      setErrorMessage(Errors.todoCreate);
    } finally {
      setTempTodo(null);
      setIsSending(false);
      focusNewTodoInput();
    }
  };

  const handleTodoDelete = async (todoId: number) => {
    if (isSending) {
      return;
    }

    const todoToDelete = todos.find(todo => todo.id === todoId);

    if (!todoToDelete) {
      return;
    }

    setIsSending(true);

    try {
      await deleteTodo(todoToDelete.id).then(response => response);

      setTodos([...todos.filter(todo => todo.id !== todoToDelete.id)]);
    } catch (error) {
      setErrorMessage(Errors.todoDelete);
    } finally {
      setIsSending(false);
      focusNewTodoInput();
    }
  };

  const handleClearCompleted = async () => {
    setDeletingCompleted(true);

    const completedTodos = todos.filter(todo => todo.completed);
    const promises = completedTodos.map(todo => {
      return deleteTodo(todo.id).then(() => todo);
    });
    const deleteResults = await Promise.allSettled(promises);

    const deletedTodos = deleteResults.reduce((acc: number[], result) => {
      if (result.status === 'rejected') {
        setErrorMessage(Errors.todoDelete);

        return acc;
      }

      acc.push(result.value.id);

      return acc;
    }, []);

    if (deletedTodos.length) {
      setTodos(todos.filter(todo => !deletedTodos.includes(todo.id)));
    }

    setDeletingCompleted(false);
  };

  useEffect(() => {
    if (errorMessageTimeout.current) {
      clearTimeout(errorMessageTimeout.current);
    }

    if (errorMessage) {
      errorMessageTimeout.current = window.setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    focusNewTodoInput();

    return () => {
      if (errorMessageTimeout.current) {
        clearTimeout(errorMessageTimeout.current);
      }
    };
  }, [errorMessage]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todosFromServer = await getTodos().then(
          loadedTodos => loadedTodos,
        );

        setTodos(todosFromServer);
      } catch (error) {
        setErrorMessage(Errors.todosLoad);
      } finally {
        focusNewTodoInput();
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    focusNewTodoInput();
  }, []);

  useEffect(() => {
    focusNewTodoInput();
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: todos.every(todo => todo.completed) && todos.length > 0,
            })}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleNewTodoFormSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={newTodoInput}
              value={newTodoTitle}
              onChange={event => setNewTodoTitle(event.target.value)}
              disabled={isSending}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              tempTodo={tempTodo}
              onDelete={handleTodoDelete}
              deletingCompleted={deletingCompleted}
            />
          ))}

          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              tempTodo={tempTodo}
              onDelete={handleTodoDelete}
              deletingCompleted={deletingCompleted}
            />
          )}

          {/* This todo is being edited */}
          {false && (
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              {/* This form is shown instead of the title and remove button */}
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
          )}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todosCounter} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filterBy === Filter.all,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilterBy(Filter.all)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filterBy === Filter.active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilterBy(Filter.active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filterBy === Filter.completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilterBy(Filter.completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!hasAnyCompletedTodos}
              onClick={handleClearCompleted}
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
          {
            hidden: !errorMessage,
          },
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
