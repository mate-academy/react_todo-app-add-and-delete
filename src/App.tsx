/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import {
  getTodos,
  createTodo,
  deleteTodo,
  USER_ID,
} from './api/todos';

import { Footer, TodoStatus } from './components/Footer';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import { Todo as TodoItem } from './components/Todo';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteringByCompleted, setFilteringByCompleted] = useState<TodoStatus>(
    TodoStatus.ALL,
  );
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.NONE,
  );
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-hide error notification after 3 seconds
  useEffect(() => {
    if (errorMessage === ErrorMessage.NONE) return;

    const timer = setTimeout(() => {
      setErrorMessage(ErrorMessage.NONE);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  // Load todos on mount
  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.FAILED_LOAD);
      });
  }, []);

  // Return focus to the input when submitting completes
  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [isSubmitting, todos.length]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.EMPTY_TITLE);
      return;
    }

    setIsSubmitting(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    createTodo({
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.FAILED_ADD);
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodoIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.FAILED_DELETE);
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
        inputRef.current?.focus();
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  const filteredTodos = todos.filter(todo => {
    switch (filteringByCompleted) {
      case TodoStatus.ACTIVE:
        return !todo.completed;
      case TodoStatus.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  const incompleteTodoQuantity = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.length !== incompleteTodoQuantity;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosCount={todos.length}
          activeCount={incompleteTodoQuantity}
          title={title}
          setTitle={setTitle}
          onSubmit={handleAddTodo}
          isSubmitting={isSubmitting}
          inputRef={inputRef}
        />

        {(!!todos.length || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isLoading={loadingTodoIds.includes(todo.id)}
                onDelete={handleDeleteTodo}
              />
            ))}

            {tempTodo && (
              <TodoItem
                todo={tempTodo}
                isLoading={true}
              />
            )}
          </section>
        )}

        {!!todos.length && (
          <Footer
            incompleteTodoQuantity={incompleteTodoQuantity}
            onFilterSelect={setFilteringByCompleted}
            activeFiltering={filteringByCompleted}
            isAnyTodoCompleted={hasCompletedTodos}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* Notification Toast */}
      <div
        className={`notification is-danger is-light has-text-weight-normal ${
          errorMessage === ErrorMessage.NONE ? 'hidden' : ''
        }`}
        data-cy="ErrorNotification"
      >
        <button
          type="button"
          className="delete"
          data-cy="HideErrorButton"
          onClick={() => setErrorMessage(ErrorMessage.NONE)}
        />
        {errorMessage}
      </div>
    </div>
  );
};