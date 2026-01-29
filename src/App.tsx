/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, createTodo, deleteTodo } from './api/todo';
import { Todo } from './types/Todo';
import { NO_TODO, NO_TITLE, NO_DELETE } from './utils/errorMessages';

import { Header } from './components/header';
import { TodoList } from './components/todoList';
import { Footer } from './components/footer';
import { ErrorNotification } from './components/errorNotification';

type FilterType = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [query, setQuery] = React.useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState<number[]>([]);

  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setErrorMessage('');

    if (!query.trim()) {
      setErrorMessage(NO_TITLE);

      inputRef.current?.focus();

      return;
    }

    setIsSubmitting(true);

    setTempTodo({
      id: 0,
      title: query.trim(),
      completed: false,
      userId: 3876,
    });

    const title = query.trim();

    createTodo({ title, completed: false, userId: 3876 })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setQuery('');
      })
      .catch(() => {
        setErrorMessage(NO_TODO);
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  const handleDelete = (todoId: number) => {
    setIsLoading(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(NO_DELETE);
      })
      .finally(() => {
        setIsLoading(prev => prev.filter(id => id !== todoId));
        inputRef.current?.focus();
      });
  };

  const onClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDelete(todo.id);
    });
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const uncompletedCount = todos.filter(todo => !todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          query={query}
          setQuery={setQuery}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          inputRef={inputRef}
          completedCount={completedCount}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              visibleTodos={visibleTodos}
              tempTodo={tempTodo}
              isLoading={isLoading}
              onDelete={handleDelete}
            />

            <Footer
              uncompletedCount={uncompletedCount}
              completedCount={completedCount}
              onClearCompleted={onClearCompleted}
              setFilter={setFilter}
              filter={filter}
            />
          </>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        setErrorMessage={setErrorMessage}
        errorMessage={errorMessage}
      />
    </div>
  );
};
