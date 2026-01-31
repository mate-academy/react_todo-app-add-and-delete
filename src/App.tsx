/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as todoServise from './api/todos';
import { Todo } from './types/Todo';
import {
  TodoList,
  Footer,
  Header,
  Error,
  UserWarning,
  TodoItem,
} from './components';
import { filterTodos } from './use_cases/filterTodos';
import { FilterState } from './types/FilterState';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | ''>('');
  const [selectedFilter, setSelectedFilter] = useState<FilterState>(
    FilterState.All,
  );
  // App.tsx
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const hasCompleted = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );

  const errorTimerId = useRef(0);

  const showError = (message: ErrorMessage) => {
    setErrorMessage(message);
    window.clearTimeout(errorTimerId.current);
    errorTimerId.current = window.setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    setErrorMessage('');
    todoServise
      .getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.Load));
  }, []);

  function handleAddTodo(title: string): Promise<void> {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError(ErrorMessage.EmptyTitle);

      return Promise.reject();
    }

    const newTempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: todoServise.USER_ID,
    };

    setTempTodo(newTempTodo);
    setIsSubmitting(true);

    return todoServise
      .createTodo(trimmedTitle)
      .then(apiTodo => {
        setTodos(prevTodos => [...prevTodos, apiTodo]);
      })
      .catch(() => {
        showError(ErrorMessage.Add);
        throw new window.Error(ErrorMessage.Add);
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
      });
  }

  function handleDeleteTodo(todoId: number) {
    setLoadingIds(prev => [...prev, todoId]);

    todoServise
      .deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        showError(ErrorMessage.Delete);
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todoId));
      });
  }

  function handleHideError() {
    setErrorMessage('');
  }

  function handleFilterChange(
    event: React.MouseEvent,
    newFilterState: FilterState,
  ) {
    event.preventDefault();

    setSelectedFilter(newFilterState);
  }

  const filteredTodos = useMemo(
    () => filterTodos(selectedFilter, '', todos),
    [todos, selectedFilter],
  );

  if (!todoServise.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onAddTodo={handleAddTodo}
          isSubmitting={isSubmitting}
        />

        {todos.length > 0 && (
          <TodoList
            filteredTodos={filteredTodos}
          onDeleteTodo={handleDeleteTodo}
            loadingIds={loadingIds}
        />)}

        {tempTodo && (
          <TodoItem todo={tempTodo} onDeleteTodo={handleDeleteTodo} />
        )}

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            selectedFilter={selectedFilter}
            hasCompleted={hasCompleted}
            onFilterChange={handleFilterChange}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} handleHideError={handleHideError} />
    </div>
  );
};
