import React, { useEffect, useMemo, useState, useRef } from 'react';
import * as todoServese from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessages } from './types/ErrorMessages';
import { TodoItems } from './components/TodoItems/TodoItems';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNotif/ErrorNotification';

export enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [addNewTodo, setAddNewTodo] = useState('');
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const newTodoInputRef = useRef<HTMLInputElement>(null);
  const errorTimeoutRef = useRef<number | null>(null);
  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);
  const uncompletedTodosCount = todos.filter(todo => !todo.completed).length;
  const isErrorVisible = errorMessage.length > 0;

  const handleError = React.useCallback((message: string) => {
    if (errorTimeoutRef.current !== null) {
      window.clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }

    setErrorMessage(message);
    if (message) {
      const timeoutId = window.setTimeout(() => {
        setErrorMessage('');
        errorTimeoutRef.current = null;
      }, 3000);

      errorTimeoutRef.current = timeoutId;
    }
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = addNewTodo.trim();

    if (trimmedTitle === '') {
      handleError(ErrorMessages.TitleEmpty);

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
        handleError(ErrorMessages.AddFail);
      })
      .finally(() => {
        setLoading(false);
        setLoadingTodoId(null);
      });
  };

  const handleDelate = (todoID: number) => {
    setLoading(true);
    setLoadingTodoId(todoID);

    todoServese
      .deleteTodo(todoID)
      .then(() => {
        setTodos(prev => prev.filter(p => p.id !== todoID));
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.DeleteFail);
      })
      .finally(() => {
        setLoading(false);
        setLoadingTodoId(null);
      });
  };

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

        handleError(ErrorMessages.DeleteFail);

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
    setLoading(true);
    todoServese
      .getTodos()
      .then(setTodos)
      .catch(() => {
        handleError(ErrorMessages.LoadFail);
      })
      .finally(() => setLoading(false));

    return () => {
      if (errorTimeoutRef.current) {
        window.clearTimeout(errorTimeoutRef.current);
        errorTimeoutRef.current = null;
      }
    };
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
              handleDelate={handleDelate}
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
