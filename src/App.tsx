/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as todoService from './api/todos';
import { filterTodos } from './use_cases/filterTodos';
import {
  TodoList,
  Footer,
  Header,
  Error,
  TodoItem,
} from './components';
import { 
  Todo, 
  FilterState, 
  ErrorMessage } from './types';




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
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.Load));
  }, []);

  const todoFieldRef = useRef<HTMLInputElement>(null);

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
      userId: todoService.USER_ID,
    };

    setTempTodo(newTempTodo);
    setIsSubmitting(true);

    return todoService
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

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
        todoFieldRef.current?.focus();
      })
      .catch(() => {
        showError(ErrorMessage.Delete);
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todoId));
      });
  }

  function handleClearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(todo => {
      setLoadingIds(prev => [...prev, todo.id]);
      
      return todoService.deleteTodo(todo.id)
        .then(() => todo.id)
        .catch(() => {
          showError(ErrorMessage.Delete);
          return null;
        })
        .finally(() => {
          setLoadingIds(prev => prev.filter(id => id !== todo.id));
        });
    });

    Promise.all(deletePromises).then(results => {
      const deletedIds = results.filter(id => id !== null);
      setTodos(prev => prev.filter(todo => !deletedIds.includes(todo.id)));
      todoFieldRef.current?.focus();
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

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={todos}
          onAddTodo={handleAddTodo}
          isSubmitting={isSubmitting}
          todoFieldRef={todoFieldRef}  
        />

        {todos.length > 0 && (
          <TodoList
            filteredTodos={filteredTodos}
            onDeleteTodo={handleDeleteTodo}
            loadingIds={loadingIds}
          />
        )}

        {tempTodo && (
          <TodoItem todo={tempTodo} onDeleteTodo={handleDeleteTodo} />
        )}

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            selectedFilter={selectedFilter}
            hasCompleted={hasCompleted}
            onFilterChange={handleFilterChange}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} handleHideError={handleHideError} />
    </div>
  );
};
