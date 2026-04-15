import React, { useEffect, useMemo, useState, useRef } from 'react';
import * as todoServese from './api/todos';
import { Todo } from './types/Todo';

import { TodoItems } from './components/TodoItems/TodoItems';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';

import { ErrorMessages } from './types/ErrorMessages';
import { ErrorNotification } from './components/ErrorNotif/ErrorNotification';

export enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  // #region State
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorMessages | null>(null);
  const [loading, setLoading] = useState(true);
  const [addNewTodo, setAddNewTodo] = useState('');
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const newTodoInputRef = useRef<HTMLInputElement>(null);
  const uncompletedTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);
  const [restartTimerError, setRestartTimerError] = useState(false);

  // #endregion
  useEffect(() => {
    if (error === null) {
      return;
    }

    const timerId = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timerId);
  }, [error, restartTimerError]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setRestartTimerError(!restartTimerError);

    const trimmedTitle = addNewTodo.trim();

    if (trimmedTitle === '') {
      setError(ErrorMessages.TitleEmpty);

      return;
    }

    setLoading(true);

    const newTodo: Omit<Todo, 'id'> = {
      title: trimmedTitle,
      userId: todoServese.USER_ID,
      completed: false,
    };

    setLoadingTodoId(todoServese.USER_ID);

    todoServese
      .createTodo(newTodo)
      .then(newTodoFromServer => {
        setTodos(currentTodos => [...currentTodos, newTodoFromServer]);
        setAddNewTodo('');
      })
      .catch(() => {
        setError(ErrorMessages.AddFail);
      })
      .finally(() => {
        setLoading(false);
        setLoadingTodoId(null);
      });
  };

  const handleDelete = (todoID: number) => {
    setError(null);
    setLoading(true);
    setLoadingTodoId(todoID);

    todoServese
      .deleteTodo(todoID)
      .then(() => {
        setTodos(prev => prev.filter(p => p.id !== todoID));
      })
      .catch(() => {
        setError(ErrorMessages.DeleteFail);
      })
      .finally(() => {
        setLoading(false);
        setLoadingTodoId(null);
      });
  };

  const handleDeleteClearCompleted = () => {
    setError(null);

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

        setError(ErrorMessages.DeleteFail);

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

  useEffect(() => {
    setError(null);
    setLoading(true);
    todoServese
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setError(ErrorMessages.LoadFail);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading && newTodoInputRef.current) {
      newTodoInputRef.current.focus();
    }
  }, [loading]);

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

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputRef={newTodoInputRef}
          todos={todos}
          addNewTodo={addNewTodo}
          setAddNewTodo={setAddNewTodo}
          handleSubmit={handleSubmit}
          loading={loading}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItems
              key={todo.id}
              todo={todo}
              loadingTodo={
                loadingTodoId === todo.id || deletingTodoIds.includes(todo.id)
              }
              handleDelete={handleDelete}
            />
          ))}

          {loading && loadingTodoId === todoServese.USER_ID && (
            <TodoItems
              key={-1}
              todo={{
                id: -1,
                title: addNewTodo,
                userId: todoServese.USER_ID,
                completed: false,
              }}
              loadingTodo={loading}
              handleDelete={handleDelete}
            />
          )}
        </section>

        {todos.length > 0 && (
          <Footer
            uncompletedTodosCount={uncompletedTodosCount}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            handleDeleteClearCompleted={handleDeleteClearCompleted}
            completedTodosCount={completedTodos.length}
          />
        )}
      </div>

      <ErrorNotification errorMessage={error} onClose={() => setError(null)} />
    </div>
  );
};
