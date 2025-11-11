//#region Import
import React, { useEffect, useMemo, useState, useRef } from 'react';

import * as todoServese from './api/todos';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNotif/ErrorNotification';
//#endregion
export enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  // #region Stats

  //  *todo
  const [todos, setTodos] = useState<Todo[]>([]);

  //  *loading
  const [loading, setLoading] = useState(true);
  const [addNewTodo, setAddNewTodo] = useState('');
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);

  //  *deleteing
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  //  *Error message
  const [errorMessage, setErrorMessage] = useState('');

  // #endregion
  // #region FilterStatus / Calculations / Refs

  //  Filter status
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );

  // FocisRef
  const newTodoInputRef = useRef<HTMLInputElement>(null);

  // Error timeout ref
  const errorTimeoutRef = useRef<number | null>(null);

  // +
  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  // -
  const uncompletedTodosCount = todos.filter(todo => !todo.completed).length;

  const isErrorVisible = errorMessage.length > 0;

  // #endregion
  // #region Handlers

  const handleError = React.useCallback((message: string) => {
    if (errorTimeoutRef.current !== null) {
      window.clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }

    setErrorMessage(message);
    // Додаємо перевірку: якщо message не порожній, тільки тоді запускаємо таймер
    if (message) {
      const timeoutId = window.setTimeout(() => {
        setErrorMessage('');
        errorTimeoutRef.current = null;
      }, 3000);

      errorTimeoutRef.current = timeoutId;
    }
  }, []);

  // Додавання Todo
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = addNewTodo.trim();

    if (trimmedTitle === '') {
      handleError('Title should not be empty');

      return;
    }

    setLoading(true);

    const newTodo: Omit<Todo, 'id'> = {
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setLoadingTodoId(USER_ID);

    todoServese
      .createTodo(newTodo)
      .then(newTodoFromServer => {
        // handleError('');
        setTodos(currentTodos => [...currentTodos, newTodoFromServer]);
        setAddNewTodo('');
      })
      .catch(() => {
        handleError('Unable to add a todo');
      })
      .finally(() => {
        setLoading(false);
        setLoadingTodoId(null);
      });
  };

  //  Видалення одного todo
  const handleDelate = (todoID: number) => {
    setLoading(true);
    setLoadingTodoId(todoID);

    todoServese
      .deleteTodo(todoID)
      .then(() => {
        setTodos(prev => prev.filter(p => p.id !== todoID));
      })
      .catch(() => {
        handleError('Unable to delete a todo');
      })
      .finally(() => {
        setLoading(false);
        setLoadingTodoId(null);
      });
  };

  // Масове видалення завершених todo
  const hendeDelateClearCompleted = () => {
    if (completedTodos.length === 0) {
      return;
    }

    setLoading(true);

    const idsToDelete = completedTodos.map(todo => todo.id);

    setDeletingTodoIds(idsToDelete);

    const failedIds: number[] = [];

    const deletePromises = completedTodos.map(todo =>
      todoServese.deleteTodo(todo.id).catch(() => {
        failedIds.push(todo.id);

        handleError('Unable to delete a todo');

        return null;
      }),
    );

    Promise.all(deletePromises)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(
            todo => !todo.completed || failedIds.includes(todo.id),
          ),
        );
      })
      .finally(() => {
        setDeletingTodoIds([]);
        setLoading(false);
      });
  };

  //#endregion
  // #region useEffects

  // Initial load
  useEffect(() => {
    setLoading(true);
    todoServese
      .getTodos()
      .then(setTodos)
      .catch(() => {
        handleError('Unable to load todos');
      })
      .finally(() => setLoading(false));

    return () => {
      if (errorTimeoutRef.current) {
        window.clearTimeout(errorTimeoutRef.current);
        errorTimeoutRef.current = null;
      }
    };
  }, []);

  // Focus logic
  useEffect(() => {
    if (!loading && newTodoInputRef.current) {
      newTodoInputRef.current.focus();
    }
  }, [loading]);

  //#endregion
  // #region Filters

  // Filter todos
  const filteredTodos = useMemo(() => {
    switch (filterStatus) {
      case FilterStatus.All:
        return todos;

      case FilterStatus.Active:
        return todos.filter(todo => !todo.completed);

      case FilterStatus.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, filterStatus]);

  // #endregion

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          ref={newTodoInputRef}
          todos={todos}
          addNewTodo={addNewTodo}
          setAddNewTodo={setAddNewTodo}
          handleSubmit={handleSubmit}
          loading={loading}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoList
              key={todo.id}
              todo={todo}
              loadingTodo={
                loadingTodoId === todo.id || deletingTodoIds.includes(todo.id)
              }
              handleDelate={handleDelate}
            />
          ))}
          {loading && loadingTodoId === USER_ID && (
            <TodoList
              key={-1}
              todo={{
                id: -1,
                title: addNewTodo,
                userId: USER_ID,
                completed: false,
              }}
              loadingTodo={loading}
              handleDelate={handleDelate}
            />
          )}
        </section>

        {todos.length > 0 && (
          <Footer
            uncompletedTodosCount={uncompletedTodosCount}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            hendeDelateClearCompleted={hendeDelateClearCompleted}
            completedTodosCount={completedTodos.length}
          />
        )}
      </div>

      <ErrorNotification
        isErrorVisible={isErrorVisible}
        errorMessage={errorMessage}
        onClose={() => handleError('')}
      />
    </div>
  );
};
