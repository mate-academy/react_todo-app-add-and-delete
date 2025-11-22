/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';
import classNames from 'classnames';
import { FilterStatus } from './types/FilterStatus';
import { MainSection } from './components/MainSection/MainSection';
import { Header } from './components/Header/Header';
import { TodoItem } from './components/TodoItem/TodoItem';
import { Footer } from './components/Footer/Footer';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  // const [isLoading, setIsLoading] = useState(false);
  const [loadTodosError, setLoadTodosError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [addTodosError, setAddTodosError] = useState('');
  const [updateTodosError, setUpdateTodosError] = useState('');
  const [deleteTodosError, setDeleteTodosError] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [errorTimerId, setErrorTimerId] = useState<number | null>(null);

  const [tempTodo, setTempTodo] = useState<Omit<Todo, 'id'> | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  const newTodoInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    const newTodoData = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTodoData);

    if (trimmedTitle === '') {
      setTitleError('Title should not be empty');

      return;
    }

    setAddTodosError('');
    setIsProcessing(true);
    setTempTodo(newTodoData);

    try {
      const createdTodo = await client.post<Todo>('/todos', newTodoData);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setTitle('');
    } catch (err) {
      setAddTodosError('Unable to add a todo');
    } finally {
      setIsProcessing(false);
      setTempTodo(null);

      if (newTodoInputRef.current) {
        const inputElement = newTodoInputRef.current;

        setTimeout(() => {
          inputElement.focus();
        }, 0);
      }
    }
  };

  const handleDelete = async (todoId: number) => {
    setDeleteTodosError('');
    setDeletingTodoId(todoId);

    try {
      await client.delete(`/todos/${todoId}`);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (err) {
      setDeleteTodosError('Unable to delete a todo');
    } finally {
      setDeletingTodoId(null);

      if (newTodoInputRef.current) {
        const inputElement = newTodoInputRef.current;

        setTimeout(() => {
          inputElement.focus();
        }, 0);
      }
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setDeleteTodosError('');
    setIsProcessing(true);

    const deletionPromises = completedTodos.map(todo => {
      return client.delete(`/todos/${todo.id}`);
    });

    try {
      const results = await Promise.allSettled(deletionPromises);

      const successfulDeletions = results
        .map((result, index) => ({ result, todo: completedTodos[index] }))
        .filter(item => item.result.status === 'fulfilled')
        .map(item => item.todo.id);

      const failedDeletions = results.filter(
        result => result.status === 'rejected',
      );

      setTodos(currentTodos =>
        currentTodos.filter(todo => !successfulDeletions.includes(todo.id)),
      );

      if (failedDeletions.length > 0) {
        setDeleteTodosError('Unable to delete a todo');
      }
    } catch (err) {
      setDeleteTodosError('Unable to delete a todo');
    } finally {
      setIsProcessing(false);

      if (newTodoInputRef.current) {
        const inputElement = newTodoInputRef.current;

        setTimeout(() => {
          inputElement.focus();
        }, 0);
      }
    }
  };

  const error =
    loadTodosError ||
    titleError ||
    addTodosError ||
    updateTodosError ||
    deleteTodosError;

  const visibleTodos = (todos || []).filter(todo => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return !todo.completed;
      case FilterStatus.Completed:
        return todo.completed;
      case FilterStatus.All:
      default:
        return true;
    }
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  useEffect(() => {
    const loadTodos = async () => {
      setIsAppLoading(true);
      setLoadTodosError('');

      try {
        const fetchedTodos = await client.get<Todo[]>(
          `/todos?userId=${USER_ID}`,
        );

        setTodos(fetchedTodos);
      } catch (err) {
        setLoadTodosError('Unable to load todos');
      } finally {
        setIsAppLoading(false);
      }
    };

    loadTodos();
  }, []);

  const hideError = () => {
    setLoadTodosError('');
    setTitleError('');
    setAddTodosError('');
    setDeleteTodosError('');
    setUpdateTodosError('');
  };

  useEffect(() => {
    if (error) {
      if (errorTimerId !== null) {
        clearTimeout(errorTimerId);
      }

      const newTimerId = setTimeout(() => {
        hideError();
      }, 3000) as unknown as number;

      setErrorTimerId(newTimerId);
    }

    return () => {
      if (errorTimerId !== null) {
        clearTimeout(errorTimerId);
      }
    };
  }, [error, errorTimerId]);

  useEffect(() => {
    if (!isAppLoading && newTodoInputRef.current) {
      newTodoInputRef.current.focus();
    }
  }, [isAppLoading]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          activeCount={activeCount}
          title={title}
          setTitle={setTitle}
          handleSubmit={handleSubmit}
          isAppLoading={isAppLoading || isProcessing}
          newTodoInputRef={newTodoInputRef}
        />

        {isAppLoading && (
          <p className="notification is-info is-light">Loading todos...</p>
        )}

        <MainSection
          todos={todos}
          visibleTodos={visibleTodos}
          handleDelete={handleDelete}
          deletingTodoId={deletingTodoId}
        />

        {tempTodo && (
          <section className="todoapp__main" data-cy="TodoList">
            <ul className="todo-list">
              <TodoItem todo={tempTodo} isTemp={true} />
            </ul>
          </section>
        )}

        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            hasCompleted={hasCompleted}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        // FIX 17: Use conditional class to hide/show the notification
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />

        {error && <p>{error}</p>}
      </div>
    </div>
  );
};
