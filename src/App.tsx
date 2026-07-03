/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  USER_ID,
  addTodo,
  updateTodo,
  deleteTodo,
} from './api/todos';
import { useState } from 'react';
import { TodosList } from './components/TodosList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';

type FilterType = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [allTodosCompleted, setAllTodosCompleted] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<Set<number>>(new Set());
  const [bulkOperationInProgress, setBulkOperationInProgress] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [error, setError] = useState<string | null>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const newTodoInputRef = useRef<HTMLInputElement>(null);
  const [taskCounter, setTaskCounter] = useState(0);
  const tempTodoCounterRef = useRef(0);

  // Function to show error with auto-dismiss after 3 seconds
  const showError = (message: string) => {
    setError(message);
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    errorTimeoutRef.current = setTimeout(() => {
      setError(null);
    }, 3000);
  };

  // Load todos on component mount
  useEffect(() => {
    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        showError('Unable to load todos');
      });
  }, []);

  // Function to close error manually
  const handleCloseError = () => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    setError(null);
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  // Focus the new todo input field on component mount
  useEffect(() => {
    if (newTodoInputRef.current) {
      newTodoInputRef.current.focus();
    }
  }, []);

  // Calculate if all todos are completed dynamically
  useEffect(() => {
    const isAllCompleted =
      todos.length > 0 && todos.every(todo => todo.completed);

    setAllTodosCompleted(isAllCompleted);
    setTaskCounter(todos.filter(todo => !todo.completed && todo.id > 0).length);
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      showError('Title should not be empty');

      return;
    }

    setIsAdding(true);

    // Create a temporary todo with a unique negative ID for optimistic update
    const tempTodoId = -++tempTodoCounterRef.current;
    const tempTodo: Todo = {
      id: tempTodoId,
      title: inputValue.trim(),
      completed: false,
      userId: USER_ID,
    };

    // Add temporary todo immediately
    setTodos(prevTodos => [...prevTodos, tempTodo]);
    setLoadingTodoIds(prev => new Set(prev).add(tempTodoId));

    addTodo(inputValue.trim())
      .then(newTodo => {
        // Replace the temporary todo with the actual one from the server
        setTodos(todosarr =>
          todosarr.map(todo => (todo.id === tempTodoId ? newTodo : todo)),
        );
        setInputValue('');
        setIsAdding(false);
        setLoadingTodoIds(prev => {
          const newSet = new Set(prev);

          newSet.delete(tempTodoId);

          return newSet;
        });

        // Focus the input field for adding the next todo
        // Use setTimeout to ensure React has finished updating the DOM
        setTimeout(() => {
          if (newTodoInputRef.current) {
            newTodoInputRef.current.focus();
          }
        }, 0);
      })
      .catch(() => {
        showError('Unable to add a todo');
        // Remove the temporary todo if the request fails
        setTodos(todosarr => todosarr.filter(todo => todo.id !== tempTodoId));
        setIsAdding(false);
        setLoadingTodoIds(prev => {
          const newSet = new Set(prev);

          newSet.delete(tempTodoId);

          return newSet;
        });

        // Focus the input field for adding the next todo
        // Use setTimeout to ensure React has finished updating the DOM
        setTimeout(() => {
          if (newTodoInputRef.current) {
            newTodoInputRef.current.focus();
          }
        }, 0);
      });
  };

  const handleUpdateTodo = (id: number, updates: Partial<Todo>) => {
    setLoadingTodoIds(prev => new Set(prev).add(id));

    return updateTodo(id, updates)
      .then(updatedTodo => {
        setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
      })
      .catch(err => {
        showError('Unable to update a todo');
        throw err;
      })
      .finally(() => {
        setLoadingTodoIds(prev => {
          const newSet = new Set(prev);

          newSet.delete(id);

          return newSet;
        });
      });
  };

  const handleDeleteTodo = (id: number) => {
    setLoadingTodoIds(prev => new Set(prev).add(id));

    return deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));

        setTimeout(() => {
          if (newTodoInputRef.current) {
            newTodoInputRef.current.focus();
          }
        }, 0);
      })
      .catch(err => {
        showError('Unable to delete a todo');
        throw err;
      })
      .finally(() => {
        setLoadingTodoIds(prev => {
          const newSet = new Set(prev);

          newSet.delete(id);

          return newSet;
        });
      });
  };

  const handleToggleAll = () => {
    const newCompletedStatus = !allTodosCompleted;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== newCompletedStatus,
    );

    setBulkOperationInProgress(true);
    setLoadingTodoIds(new Set(todosToUpdate.map(todo => todo.id)));

    const updatePromises = todosToUpdate.map(todo =>
      updateTodo(todo.id, { completed: newCompletedStatus }),
    );

    Promise.allSettled(updatePromises).then(results => {
      const successfullyUpdatedIds = todosToUpdate
        .filter((_, index) => results[index].status === 'fulfilled')
        .map(todo => todo.id);

      setTodos(prevTodos =>
        prevTodos.map(todo => {
          if (successfullyUpdatedIds.includes(todo.id)) {
            return { ...todo, completed: newCompletedStatus };
          }

          return todo;
        }),
      );

      const hasErrors = results.some(res => res.status === 'rejected');

      if (hasErrors) {
        showError('Unable to update a todo');
      }

      setBulkOperationInProgress(false);
      setLoadingTodoIds(new Set());
    });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setBulkOperationInProgress(true);
    setLoadingTodoIds(new Set(completedTodos.map(todo => todo.id)));

    // 1. Використовуємо Promise.allSettled замість Promise.all
    Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id))).then(
      results => {
        // 2. Визначаємо ID тих тудушок, які видалилися УСПІШНО (status === 'fulfilled')
        const successfullyDeletedIds = completedTodos
          .filter((_, index) => results[index].status === 'fulfilled')
          .map(todo => todo.id);

        // 3. Оновлюємо стейт, прибираючи тільки ті, що успішно видалилися з сервера
        // (Використовуємо функцію prevTodos, щоб уникнути багів зі застарілим стейтом)
        setTodos(prevTodos =>
          prevTodos.filter(todo => !successfullyDeletedIds.includes(todo.id)),
        );

        // 4. Перевіряємо, чи була хоча б одна помилка (status === 'rejected')
        const hasErrors = results.some(res => res.status === 'rejected');

        if (hasErrors) {
          showError('Unable to delete a todo');
        }

        setBulkOperationInProgress(false);
        setLoadingTodoIds(new Set());

        // 5. Повертаємо фокус на інпут
        setTimeout(() => {
          if (newTodoInputRef.current) {
            newTodoInputRef.current.focus();
          }
        }, 0);
      },
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          allTodosCompleted={allTodosCompleted}
          inputValue={inputValue}
          isAdding={isAdding}
          todosLength={todos.length}
          onToggleAll={handleToggleAll}
          onInputChange={setInputValue}
          onSubmit={handleSubmit}
          newTodoInputRef={newTodoInputRef}
        />

        <TodosList
          todos={filteredTodos}
          loadingTodoIds={loadingTodoIds}
          bulkOperationInProgress={bulkOperationInProgress}
          onUpdate={handleUpdateTodo}
          onDelete={handleDeleteTodo}
        />

        <Footer
          taskCounter={taskCounter}
          filter={filter}
          todosLength={todos.length}
          hasCompletedTodos={todos.some(todo => todo.completed)}
          onFilterChange={setFilter}
          onClearCompleted={handleClearCompleted}
        />
      </div>

      <ErrorNotification error={error} onClose={handleCloseError} />
    </div>
  );
};
