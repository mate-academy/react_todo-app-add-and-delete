/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  getTodos,
  deleteTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { FilterStatus } from './types/FilterStatus';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  // const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  // const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  useEffect(() => {
    setErrorMessage(null);

    getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'));
  }, []);

  const visibleTodos = todos.filter(todo => {
    if (filter === FilterStatus.Active) {
      return !todo.completed;
    }

    if (filter === FilterStatus.Completed) {
      return todo.completed;
    }

    return true;
  });

  const addTodo = useCallback((title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError('Title should not be empty');

      return Promise.reject();
    }

    setErrorMessage(null);

    const newTodoPlaceholder: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTodoPlaceholder);

    return createTodo(newTodoPlaceholder)
      .then(newTodoFromServer => {
        setTodos(currentTodos => [...currentTodos, newTodoFromServer]);
      })
      .catch(() => {
        showError('Unable to add a todo');
        throw new Error();
      })
      .finally(() => {
        setTempTodo(null);
      });
  }, []);

  const handleDeleteTodo = useCallback((todoId: number) => {
    setErrorMessage(null);
    setLoadingTodoIds(prev => [...prev, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        showError('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
      });
  }, []);

  const handleUpdateTodo = useCallback(
    (todoId: number, data: Partial<Todo>) => {
      setErrorMessage(null);
      setLoadingTodoIds(prev => [...prev, todoId]);

      return updateTodo(todoId, data)
        .then(updatedTodo => {
          setTodos(currentTodos =>
            currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
          );
        })
        .catch(() => {
          showError('Unable to update a todo');
          throw new Error();
        })
        .finally(() => {
          setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
        });
    },
    [],
  );

  const handleToggleAll = useCallback(() => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const todosToUpdate = areAllCompleted
      ? todos
      : todos.filter(todo => !todo.completed);

    const updatePromises = todosToUpdate.map(todo =>
      handleUpdateTodo(todo.id, { completed: !areAllCompleted }),
    );

    return Promise.all(updatePromises);
  }, [todos, handleUpdateTodo]);

  const clearCompleted = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    const clearPromises = completedTodos.map(todo => handleDeleteTodo(todo.id));

    return Promise.all(clearPromises);
  }, [todos, handleDeleteTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isAllCompleted={todos.length > 0 && todos.every(t => t.completed)}
          hasTodos={todos.length > 0}
          onAdd={addTodo}
          isAdding={!!tempTodo || loadingTodoIds.length > 0}
          onToggleAll={handleToggleAll}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={[...visibleTodos, ...(tempTodo ? [tempTodo] : [])]}
              onDelete={handleDeleteTodo}
              onUpdate={handleUpdateTodo}
              loadingTodoIds={loadingTodoIds}
            />
            <Footer
              count={todos.filter(t => !t.completed).length}
              activeFilter={filter}
              onFilterChange={setFilter}
              hasCompleted={todos.some(t => t.completed)}
              onClearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
};
