/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID, createTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Notification } from './components/Notification/Notification';
import { Footer } from './components/Footer/Footer';
import { NewTodo } from './components/NewTodo/NewTodo';
import classNames from 'classnames';
import { set } from 'cypress/types/lodash';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [todosToDelete, setTodosToDelete] = useState<Set<number>>(new Set());
  const [shouldFocus, setShouldFocus] = useState(false);

  const incompleteCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (shouldFocus) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
    setShouldFocus(false);
  }, [shouldFocus]);

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    if (completedTodos.length === 0) {
      return;
    }
    setError('');
    setLoading(true);
    setTodosToDelete(new Set(completedTodos.map(todo => todo.id)));

    try {
      const deletePromises = completedTodos.map(todo =>
        // Use the deleteTodo function, but wrap it to include the todo ID
        deleteTodo(todo.id).then(() => todo.id),
      );

      // Use Promise.allSettled to handle individual success or failure
      const results = await Promise.allSettled(deletePromises);
      const successfullyDeletedIds: number[] = [];
      const failedDeletions: number[] = [];

      // Loop through the results to find which deletions succeeded
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          successfullyDeletedIds.push(result.value);
        } else {
          failedDeletions.push(result.reason);
        }
      });

      // Update the local state to remove only the successfully deleted todos
      setTodos(prev =>
        prev.filter(todo => !successfullyDeletedIds.includes(todo.id)),
      );

      // Provide feedback for any failed deletions
      if (failedDeletions.length > 0) {
        setError('Unable to delete a todo');
      }
    } catch (error) {
      // This catch block will only be reached if Promise.allSettled itself throws an error, which is rare.
      setError('Unable to delete a todo');
    } finally {
      setLoading(false);
      setTodosToDelete(new Set());
      setShouldFocus(true);
    }
  };

  const getPreparedTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };
  function handleCreateTodo({ title, userId, completed }: Omit<Todo, 'id'>) {
    setError('');
    setLoading(true);

    createTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setInputValue('');
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);

        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 0);
      });
  }

  function handleDeleteTodo(todoId: number) {
    setError('');
    setTodosToDelete(todosToDelete => todosToDelete.add(todoId));
    setLoading(true);
    deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setLoading(false);
        setTodosToDelete(todosToDelete => {
          const newSet = new Set(todosToDelete);
          newSet.delete(todoId);
          return newSet;
        });
        setShouldFocus(true);
      });
  }

  const handleValidationError = (error: string) => {
    setError(error);
    setShouldFocus(true);
  };
  const allIsCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const hideNotification = () => {
    setError('');
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = getPreparedTodos();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: allIsCompleted,
            })}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <NewTodo
            onSubmit={handleCreateTodo}
            setTempTodo={setTempTodo}
            disabled={loading}
            inputRef={inputRef}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onError={handleValidationError}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          loading={loading}
          onDelete={handleDeleteTodo}
          todosToDelete={todosToDelete}
        />
        {todos.length > 0 && (
          <Footer
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={clearCompleted}
            incompleteCount={incompleteCount}
            hasCompletedTodos={hasCompletedTodos}
          />
        )}
      </div>
      <Notification message={error} onHide={hideNotification} />
    </div>
  );
};
