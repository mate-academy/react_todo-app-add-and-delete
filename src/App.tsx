import React, { useEffect, useRef, useState, useCallback } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, deleteTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FILTERS, FilterType } from './constants/filters';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorMessage } from './constants/errors';

let internalIdCounter = 0;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>(FILTERS.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorHidden, setIsErrorHidden] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const errorTimer = useRef<NodeJS.Timeout | null>(null);
  const focusAfterOperation = useRef(false);

  const showError = (message: string) => {
    if (errorTimer.current) {
      clearTimeout(errorTimer.current);
      errorTimer.current = null;
    }

    setErrorMessage(message);
    setIsErrorHidden(false);

    errorTimer.current = setTimeout(() => {
      setIsErrorHidden(true);
      errorTimer.current = null;
    }, 3000);
  };

  const hideError = () => {
    if (errorTimer.current) {
      clearTimeout(errorTimer.current);
      errorTimer.current = null;
    }

    setIsErrorHidden(true);
  };

  const focusInput = useCallback(() => {
    setTimeout(() => {
      const input =
        document.querySelector<HTMLInputElement>('.todoapp__new-todo');

      if (input && !input.disabled) {
        input.focus();

        setTimeout(() => {
          if (document.activeElement !== input) {
            input.focus();
          }
        }, 10);

        setTimeout(() => {
          if (document.activeElement !== input) {
            input.focus();
          }
        }, 50);
      }
    }, 100);
  }, []);

  const handleAddTodo = () => {
    const title = newTitle.trim();

    if (!title) {
      showError(ErrorMessage.EmptyTitle);
      focusInput();

      return;
    }

    setIsAdding(true);

    const tempId = --internalIdCounter;
    const temp: Todo = {
      id: tempId,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(temp);
    setLoadingIds(prev => [...prev, tempId]);

    addTodo({ userId: USER_ID, title, completed: false })
      .then(createdTodo => {
        setTodos(prev => [...prev, createdTodo]);
        setNewTitle('');
        focusAfterOperation.current = true;
      })
      .catch(() => {
        setTempTodo(null);
        setLoadingIds(prev => prev.filter(id => id !== tempId));
        setIsAdding(false);
        showError(ErrorMessage.Add);
        focusAfterOperation.current = true;
      })
      .finally(() => {
        setTempTodo(null);
        setLoadingIds(prev => prev.filter(id => id !== tempId));
        setIsAdding(false);
      });
  };

  const handleDelete = (id: number) => {
    setLoadingIds(prev => [...prev, id]);
    focusAfterOperation.current = true;

    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => {
        showError(ErrorMessage.Delete);
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(todoId => todoId !== id));
      });
  };

  const handleToggle = (id: number, completed: boolean) => {
    setLoadingIds(prev => [...prev, id]);

    setTodos(prev =>
      prev.map(todo => (todo.id === id ? { ...todo, completed } : todo)),
    );

    setLoadingIds(prev => prev.filter(todoId => todoId !== id));
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newCompletedState = !allCompleted;

    const todosToUpdate = allCompleted
      ? todos.filter(todo => todo.completed)
      : todos.filter(todo => !todo.completed);

    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setLoadingIds(prev => [...prev, ...idsToUpdate]);

    setTodos(prev =>
      prev.map(todo => ({
        ...todo,
        completed: newCompletedState,
      })),
    );

    setTimeout(() => {
      setLoadingIds(prev => prev.filter(id => !idsToUpdate.includes(id)));
    }, 300);
  };

  const handleClearCompleted = async () => {
  const completedTodos = todos.filter(todo => todo.completed);

  if (completedTodos.length === 0) return;

  const completedIds = completedTodos.map(todo => todo.id);
  setLoadingIds(prev => [...prev, ...completedIds]);

  const promises = completedIds.map(id =>
    deleteTodo(id)
      .then(() => ({ id, status: 'fulfilled' }))
      .catch(() => ({ id, status: 'rejected' }))
  );

  const results = await Promise.all(promises);

  const successfulIds = results
    .filter(result => result.status === 'fulfilled')
    .map(result => result.id);

  const failedIds = results
    .filter(result => result.status === 'rejected')
    .map(result => result.id);

  if (successfulIds.length > 0) {
    setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));
  }

  if (failedIds.length > 0) {
    showError(ErrorMessage.Delete);
  }

  focusAfterOperation.current = true;
  setLoadingIds(prev => prev.filter(id => !completedIds.includes(id)));
};

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        showError(ErrorMessage.Load);
      });
  }, []);

  useEffect(() => {
    if (focusAfterOperation.current) {
      focusInput();
      focusAfterOperation.current = false;
    }
  });

  useEffect(() => {
    return () => {
      if (errorTimer.current) {
        clearTimeout(errorTimer.current);
      }
    };
  }, []);

  const allTodos = tempTodo ? [...todos, tempTodo] : todos;

  const visibleTodos = allTodos.filter(todo => {
    if (filter === FILTERS.active) {
      return !todo.completed;
    }

    if (filter === FILTERS.completed) {
      return todo.completed;
    }

    return true;
  });

  const todosLeft = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;
  const isAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);
  const hasTodos = todos.length > 0;
  const hasCompletedTodos = completedTodosCount > 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {!USER_ID && <UserWarning />}

      {USER_ID && (
        <div className="todoapp__content">
          <Header
            title={newTitle}
            onTitleChange={setNewTitle}
            onSubmit={handleAddTodo}
            isDisabled={isAdding}
            onToggleAll={hasTodos ? handleToggleAll : undefined}
            isAllCompleted={hasTodos && isAllCompleted}
          />

          {hasTodos && (
            <>
              <TodoList
                todos={visibleTodos}
                onDelete={handleDelete}
                onToggle={handleToggle}
                loadingIds={loadingIds}
              />

              <Footer
                filter={filter}
                onFilterChange={setFilter}
                todosLeft={todosLeft}
                onClearCompleted={handleClearCompleted}
                hasCompletedTodos={hasCompletedTodos}
              />
            </>
          )}
        </div>
      )}

      <ErrorNotification
        message={errorMessage}
        isHidden={isErrorHidden}
        onClose={hideError}
      />
    </div>
  );
};
