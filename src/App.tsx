/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';

import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import classNames from 'classnames';
import { TodoItem } from './components/TodoItem';
import { FilterType } from './types/FilterType';

export const App: React.FC = () => {
  // #region state
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [hasErrorMessage, setHasErrorMessage] = useState(false);
  const [filter, setFilter] = useState('all');
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  //#endregion

  // #region loadTodos
  function loadTodos() {
    setError('');
    setHasErrorMessage(false);

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
        setHasErrorMessage(true);
        setTimeout(() => {
          setHasErrorMessage(false);
        }, 3000);
      });
  }
  //#endregion

  useEffect(loadTodos, []);

  const visibleTodos = todos.filter(todo => {
    if (filter === FilterType.Active) {
      return !todo.completed;
    }

    if (filter === FilterType.Completed) {
      return todo.completed;
    }

    return true;
  });

  const activeTodosLength = todos.filter(todo => !todo.completed).length;
  const completedTodosLength = todos.filter(todo => todo.completed).length;

  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    field.current?.focus();
  }, [submitting]);

  const addTodo = async (newTitle: string) => {
    const newTodo = await todoService.addTodos({ title: newTitle });

    setTodos(currentTodos => [...currentTodos, newTodo]);
  };

  // #region deleteTodo
  function deleteTodo(todoId: number) {
    setDeletingTodoId(todoId);

    setSubmitting(true);

    todoService
      .deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setError('Unable to delete a todo');
        setHasErrorMessage(true);
        setTimeout(() => {
          setHasErrorMessage(false);
        }, 3000);
      })
      .finally(() => {
        setDeletingTodoId(null);
        setSubmitting(false);
      });
  }
  //#endregion

  // #region clearCompleted
  const clearCompleted = async () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    if (completedIds.length === 0) {
      return;
    }

    setSubmitting(true);

    try {
      const results = await Promise.allSettled(
        completedIds.map(id => todoService.deleteTodos(id)),
      );
      // id тих, які видалились успішно
      const fulfilledIds = completedIds.filter(
        (_, i) => results[i].status === 'fulfilled',
      );

      setTodos(current =>
        current.filter(todo => !fulfilledIds.includes(todo.id)),
      );
      // якщо хоча б один не вдалось видалити — показати помилку
      if (results.some(result => result.status === 'rejected')) {
        setError('Unable to delete a todo');
        setHasErrorMessage(true);
        setTimeout(() => setHasErrorMessage(false), 3000);
      }
    } finally {
      setSubmitting(false);
    }
  };
  //#endregion

  // #region handleSubmit
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');
      setHasErrorMessage(true);
      setTimeout(() => {
        setHasErrorMessage(false);
      }, 3000);
      setSubmitting(false);
      field.current?.focus();

      return;
    }

    setSubmitting(true);

    const tempedTodo = {
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(tempedTodo);

    try {
      await addTodo(trimmedTitle);
      setTitle('');
    } catch (e) {
      setError('Unable to add a todo');
      setHasErrorMessage(true);
      setTimeout(() => {
        setHasErrorMessage(false);
      }, 3000);
    } finally {
      setTempTodo(null);
      setSubmitting(false);
    }
  };
  //#endregion

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
            className={classNames('todoapp__toggle-all', {
              active: !activeTodosLength,
            })}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              ref={field}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={submitting}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={deleteTodo}
              isLoading={deletingTodoId === todo.id}
            />
          ))}

          {tempTodo && (
            <TodoItem todo={tempTodo} onDelete={deleteTodo} isLoading={true} />
          )}
        </section>

        {todos.length !== 0 && (
          <Footer
            filtered={filter}
            onFiltered={setFilter}
            activeTodos={activeTodosLength}
            completeTodos={completedTodosLength}
            onClearCompletedTodos={clearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !hasErrorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setHasErrorMessage(false)}
        />
        {error}
      </div>
    </div>
  );
};
