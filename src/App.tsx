/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef } from 'react';
import { UserWarning } from './UserWarning';
import { useState, useEffect } from 'react';
import cn from 'classnames';

import { USER_ID, getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Footer } from './components/Footer';
import { Error } from './types/Error';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Error>(Error.Default);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const todoFieldRef = useRef<HTMLInputElement>(null);

  const activeTodos = todos.filter(todo => !todo.completed);

  const isAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const hasCompleted = todos.some(todo => todo.completed);

  const filteredTodos = todos.filter(todo => {
    if (filter === Filter.Active) {
      return !todo.completed;
    } else if (filter === Filter.Completed) {
      return todo.completed;
    } else {
      return true;
    }
  });

  const completedIds = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  const removeTodo = (todoId: number) => {
    setErrorMessage(Error.Default);
    setLoadingIds(ids => [...ids, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(Error.DeleteError);
      })
      .finally(() => {
        setLoadingIds(ids => ids.filter(id => id !== todoId));
      });
  };

  const clearCompleted = (completedTodosIds: number[]) => {
    for (const id of completedTodosIds) {
      removeTodo(id);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(Error.Default);

    const validQuery = query.trim();

    if (validQuery.length === 0) {
      setErrorMessage(Error.TitleError);

      return;
    }

    setIsSubmitting(true);

    const todo: Todo = {
      id: 0,
      userId: USER_ID,
      title: validQuery,
      completed: false,
    };

    setTempTodo(todo);

    addTodo({ userId: USER_ID, title: validQuery, completed: false })
      .then(result => {
        setTodos(prev => [...prev, result]);
        setQuery('');
      })
      .catch(() => {
        setErrorMessage(Error.AddError);
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
      });
  };

  useEffect(() => {
    setErrorMessage(Error.Default);

    getTodos()
      .then(result => setTodos(result))
      .catch(() => {
        setErrorMessage(Error.LoadError);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage(Error.Default);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorMessage]);

  useEffect(() => {
    if (!isSubmitting && loadingIds.length === 0) {
      todoFieldRef.current?.focus();
    }
  }, [isSubmitting, loadingIds]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          isAllCompleted={isAllCompleted}
          onSubmit={handleSubmit}
          query={query}
          onQueryChange={setQuery}
          isSubmitting={isSubmitting}
          todoFieldRef={todoFieldRef}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              filteredTodos={filteredTodos}
              tempTodo={tempTodo}
              onDelete={removeTodo}
              loadingIds={loadingIds}
            />

            <Footer
              activeTodos={activeTodos}
              filter={filter}
              onClick={setFilter}
              hasCompleted={hasCompleted}
              completedTodosIds={completedIds}
              onClearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: errorMessage === Error.Default },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(Error.Default)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
