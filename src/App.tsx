/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, addTodo, deleteTodo } from './api/todos';
import type { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import Errors from './components/Errors';
import { ErrorMessage } from './types/ErrorsMessage';
import Task from './components/Task';
import cn from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);

      case Filter.Completed:
        return todos.filter(todo => todo.completed);

      case Filter.All:
        return todos;

      default:
        return todos;
    }
  }, [todos, filter]);

  const unCompletedNumber = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  /// api

  useEffect(() => {
    setError(null);

    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => setError(ErrorMessage.Load));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const errorTime = setTimeout(() => setError(null), 3000);

    return () => clearTimeout(errorTime);
  }, [error]);

  // SUBMIT

  const formHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(ErrorMessage.EmptyTitle);

      return;
    }

    setError(null);

    const addingTodo = addTodo(trimmedTitle);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    addingTodo
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setError(ErrorMessage.Add);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };
  // delete

  const deleteTodoById = (todoId: number) => {
    setError(null);

    setDeletingTodoIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setError(ErrorMessage.Delete);
      })
      .finally(() => {
        setDeletingTodoIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );
      });
  };

  // clear completed

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    if (completedIds.length === 0) {
      return;
    }

    setError(null);

    setDeletingTodoIds(currentIds => [...currentIds, ...completedIds]);

    Promise.allSettled(completedIds.map(id => deleteTodo(id)))
      .then(results => {
        const successfulIds = completedIds.filter(
          (_, index) => results[index].status === 'fulfilled',
        );

        setTodos(currentTodos =>
          currentTodos.filter(todo => !successfulIds.includes(todo.id)),
        );

        if (results.some(result => result.status === 'rejected')) {
          setError(ErrorMessage.Delete);
        }
      })
      .finally(() => {
        setDeletingTodoIds(currentIds =>
          currentIds.filter(id => !completedIds.includes(id)),
        );
      });
  };

  /// text focus

  const focusText = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tempTodo === null) {
      focusText.current?.focus();
    }
  }, [tempTodo]);

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
                active: allCompleted,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          <form onSubmit={formHandler}>
            <input
              data-cy="NewTodoField"
              type="text"
              value={title}
              onChange={event => setTitle(event.target.value)}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={focusText}
              disabled={tempTodo !== null}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            onDelete={deleteTodoById}
            deletingTodoIds={deletingTodoIds}
          />
        )}

        {tempTodo && <Task todo={tempTodo} isLoading />}

        {todos.length > 0 && (
          <Footer
            unCompletedCount={unCompletedNumber}
            filter={filter}
            onFilterChange={setFilter}
            hasCompletedTodos={hasCompletedTodos}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <Errors error={error} onClose={() => setError(null)} />
    </div>
  );
};
