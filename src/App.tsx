/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

const ERROR_MESSAGES = {
  load: 'Unable to load todos',
  add: 'Unable to add a todo',
  delete: 'Unable to delete a todo',
  emptyTitle: 'Title should not be empty',
};

// const USER_ID = 4428;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ERROR_MESSAGES.load);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleAddTodo = (title: string): Promise<void> => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ERROR_MESSAGES.emptyTitle);

      return Promise.reject();
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setErrorMessage('');

    return createTodo({
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    })
      .then(createdTodo => {
        setTodos(prev => [...prev, createdTodo]);
      })
      .catch(error => {
        setErrorMessage(ERROR_MESSAGES.add);

        return Promise.reject(error);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  function handleDeleteTodo(todoId: number) {
    setLoadingTodoIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ERROR_MESSAGES.delete);
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
      });
  }

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setLoadingTodoIds(prev => [...prev, ...completedIds]);

    const deletePromises = completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => todo.id)
        .catch(() => null),
    );

    Promise.all(deletePromises)
      .then(results => {
        const successfullyDeletedIds = results.filter(
          (id): id is number => id !== null,
        );

        setTodos(prevTodos =>
          prevTodos.filter(todo => !successfullyDeletedIds.includes(todo.id)),
        );

        if (successfullyDeletedIds.length < completedTodos.length) {
          setErrorMessage(ERROR_MESSAGES.delete);
        }
      })
      .finally(() => {
        setLoadingTodoIds(prev =>
          prev.filter(id => !completedIds.includes(id)),
        );
      });
  };

  const visibleTodos = todos.filter(todo => {
    return (
      filter === FilterStatus.All ||
      (filter === FilterStatus.Completed && todo.completed) ||
      (filter === FilterStatus.Active && !todo.completed)
    );
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasTodos={todos.length > 0}
          onAdd={handleAddTodo}
          isSubmitting={tempTodo !== null}
          loadingTodoIds={loadingTodoIds}
        />

        {(todos.length > 0 || tempTodo !== null) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDelete={handleDeleteTodo}
              loadingTodoIds={loadingTodoIds}
            />
            <Footer
              activeCount={activeTodosCount}
              filter={filter}
              onFilterChange={setFilter}
              onClearCompleted={handleClearCompleted}
              hasCompletedTodos={hasCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
