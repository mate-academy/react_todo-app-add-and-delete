import React, { useState, useEffect, useMemo, useRef } from 'react';

import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';

import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [error, setError] = useState('');
  const [filterBy, setFilterBy] = useState<FilterStatus>(FilterStatus.ALL);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  const handleError = (message: string) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setTodos([]);
        handleError('Unable to load todos');
      });
  }, []);

  // #FIX: Uproszczony i bardziej niezawodny useEffect do zarządzania focusem
  useEffect(() => {
    // Ustawiamy focus po załadowaniu strony lub po pojawieniu się błędu
    if (todos !== null || error) {
      newTodoFieldRef.current?.focus();
    }
  }, [todos, error]);

  const activeTodos = useMemo(
    () => (todos || []).filter(t => !t.completed),
    [todos],
  );
  const completedTodos = useMemo(
    () => (todos || []).filter(t => t.completed),
    [todos],
  );

  const visibleTodos = useMemo(() => {
    const currentTodos = todos || [];
    switch (filterBy) {
      case FilterStatus.ACTIVE:
        return currentTodos.filter(t => !t.completed);
      case FilterStatus.COMPLETED:
        return currentTodos.filter(t => t.completed);
      default:
        return currentTodos;
    }
  }, [todos, filterBy]);

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    const trimmedTitle = newTodoTitle.trim();
    if (!trimmedTitle) {
      handleError('Title should not be empty');
      return;
    }
    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    });
    setLoadingIds(prev => [...prev, 0]);
    createTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(current => (current ? [...current, newTodo] : [newTodo]));
        setNewTodoTitle('');
      })
      .catch(() => {
        handleError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setLoadingIds(prev => prev.filter(id => id !== 0));
      });
  };

  const handleUpdateTodo = (
    todoId: number,
    data: Partial<Omit<Todo, 'id'>>,
  ) => {
    if (!todos) return;
    setError('');
    setLoadingIds(prev => [...prev, todoId]);
    updateTodo(todoId, data)
      .then(updatedTodo =>
        setTodos(current =>
          (current || []).map(t => (t.id === todoId ? updatedTodo : t)),
        ),
      )
      .catch(() => handleError('Unable to update a todo'))
      .finally(() => setLoadingIds(prev => prev.filter(id => id !== todoId)));
  };

  const handleDeleteTodo = (todoId: number) => {
    if (!todos) return;
    setError('');
    setLoadingIds(prev => [...prev, todoId]);
    deleteTodo(todoId)
      .then(() => {
        setTodos(current => (current || []).filter(todo => todo.id !== todoId));
      })
      .catch(() => handleError('Unable to delete a todo'))
      .finally(() => setLoadingIds(prev => prev.filter(id => id !== todoId)));
  };

  const handleClearCompleted = () => {
    if (!completedTodos.length) return;
    const idsToDelete = completedTodos.map(t => t.id);
    setLoadingIds(prev => [...prev, ...idsToDelete]);
    const promises = completedTodos.map(todo => deleteTodo(todo.id));
    Promise.allSettled(promises)
      .then(results => {
        const failed = results.some(r => r.status === 'rejected');
        if (failed) {
          handleError('Unable to delete a todo');
        }
        const successfulIds = results
          .map((result, index) =>
            result.status === 'fulfilled' ? idsToDelete[index] : null,
          )
          .filter(id => id !== null);
        setTodos(current =>
          (current || []).filter(t => !successfulIds.includes(t.id)),
        );
      })
      .finally(() => setLoadingIds([]));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        {todos === null ? (
          <div data-cy="TodoLoader" className="loader-container">
            <div className="loader" />
          </div>
        ) : (
          <>
            <Header
              title={newTodoTitle}
              onTitleChange={setNewTodoTitle}
              onSubmit={handleAddTodo}
              inputRef={newTodoFieldRef}
              isAdding={!!tempTodo}
            />
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              loadingIds={loadingIds}
              editingTodoId={editingTodoId}
              onUpdateTodo={handleUpdateTodo}
              onDeleteTodo={handleDeleteTodo}
              onSetEditingId={setEditingTodoId}
            />
            {todos.length > 0 && (
              <Footer
                activeCount={activeTodos.length}
                completedCount={completedTodos.length}
                filterBy={filterBy}
                onFilterBy={setFilterBy}
                onClearCompleted={handleClearCompleted}
              />
            )}
          </>
        )}
      </div>
      <ErrorNotification error={error} onErrorClose={setError} />
    </div>
  );
};
