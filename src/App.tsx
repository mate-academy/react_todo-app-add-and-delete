/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';
import * as postService from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { TodoFilter } from './components/TodoFilter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.None,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const titleField = useRef<HTMLInputElement>(null);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const showError = (message: ErrorMessage) => {
    setErrorMessage(message);
    window.setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);
  };

  useEffect(() => {
    postService
      .getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.Load));
  }, []);

  useEffect(() => {
    if (!isSubmitting && deletingTodoIds.length === 0) {
      titleField.current?.focus();
    }
  }, [isSubmitting, deletingTodoIds]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleToggleTodo = (todoId: number) => {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleDeleteTodo = (todoId: number) => {
    setDeletingTodoIds(current => [...current, todoId]);

    postService
      .deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        showError(ErrorMessage.Delete);
      })
      .finally(() => {
        setDeletingTodoIds(current => current.filter(id => id !== todoId));
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError(ErrorMessage.Empty);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setErrorMessage(ErrorMessage.None);
    setIsSubmitting(true);

    postService
      .createTodos({
        title: trimmedTitle,
        userId: USER_ID,
        completed: false,
      })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        showError(ErrorMessage.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

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

          <TodoForm
            title={title}
            isSubmitting={isSubmitting}
            onTitleChange={setTitle}
            onSubmit={handleSubmit}
            titleFieldRef={titleField}
          />
        </header>

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          deletingTodoIds={deletingTodoIds}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
        />

        {todos.length > 0 && (
          <TodoFilter
            activeTodosCount={activeTodosCount}
            filter={filter}
            hasCompletedTodos={hasCompletedTodos}
            onFilterChange={setFilter}
            onClearCompleted={() => {
              todos
                .filter(todo => todo.completed)
                .forEach(todo => handleDeleteTodo(todo.id));
            }}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onHide={() => setErrorMessage(ErrorMessage.None)}
      />
    </div>
  );
};
