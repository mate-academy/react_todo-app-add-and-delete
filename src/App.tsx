/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

enum ErrorMessages {
  None = '',
  Load = 'Unable to load todos',
  Empty = 'Title should not be empty',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.None,
  );
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const itemField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessages.Load));
  }, []);

  const visibleTodos = todos.filter(todo => {
    if (filter === FilterStatus.Active) {
      return !todo.completed;
    }

    if (filter === FilterStatus.Completed) {
      return todo.completed;
    }

    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const hasCompleted = todos.some(todo => todo.completed);

  const deleteTodo = (todoId: number) => {
    setLoadingIds(prev => [...prev, todoId]);
    todoService
      .deleteTodo(todoId)
      .then(() =>
        setTodos(current => current.filter(todo => todo.id !== todoId)),
      )
      .catch(() => {
        setErrorMessage(ErrorMessages.Delete);
        setTimeout(() => setErrorMessage(ErrorMessages.None), 3000);
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todoId));
        itemField.current?.focus();
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = query.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessages.Empty);
      setTimeout(() => setErrorMessage(ErrorMessages.None), 3000);

      return;
    }

    setTempTodo({ id: 0, userId: 4057, title: trimmedTitle, completed: false });

    todoService
      .createTodo({ userId: 4057, title: trimmedTitle, completed: false })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setQuery('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.Add);
        setTimeout(() => setErrorMessage(ErrorMessages.None), 3000);
      })
      .finally(() => {
        setTempTodo(null);
        setTimeout(() => {
          itemField.current?.focus();
        }, 0);
      });
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deletionPromises = completedTodos.map(todo => {
      return todoService
        .deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
        })
        .catch(() => {
          setErrorMessage(ErrorMessages.Delete);
          setTimeout(() => setErrorMessage(ErrorMessages.None), 3000);
        });
    });

    await Promise.all(deletionPromises);

    itemField.current?.focus();
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todoFieldRef={itemField}
          query={query}
          setQuery={setQuery}
          onSubmit={handleSubmit}
          disabled={!!tempTodo}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              onDelete={deleteTodo}
              loadingIds={loadingIds}
              tempTodo={tempTodo}
            />
            <Footer
              filter={filter}
              setFilter={f => setFilter(f as FilterStatus)}
              activeCount={activeTodosCount}
              hasCompleted={hasCompleted}
              onClearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage(ErrorMessages.None)}
      />
    </div>
  );
};
