/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, createTodos, deleteTodos } from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { TodoFilter } from './components/TodoFilter';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState(FilterStatus.All);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const newTodoFieldRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setIsLoading(true);
        setError('');

        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch (e) {
        setError('Unable to load todos');
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (error) {
      const timerId = setTimeout(() => {
        setError('');
      }, 3000);

      return () => {
        clearTimeout(timerId);
      };
    }

    return undefined;
  }, [error]);

  useEffect(() => {
    if (!isAddingTodo && newTodoFieldRef.current) {
      newTodoFieldRef.current.focus();
    }
  }, [isAddingTodo]);

  const hideErrorNotification = () => {
    setError('');
  };

  const handleTodoSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');

      return;
    }

    try {
      setIsAddingTodo(true);

      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      const newTodo = await createTodos(trimmedTitle);

      setTodos(prevTodos => [...prevTodos, newTodo]);
      setNewTodoTitle('');
    } catch (e) {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsAddingTodo(false);
      if (newTodoFieldRef.current) {
        newTodoFieldRef.current.focus();
      }
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeletingTodoIds(prev => [...prev, todoId]);

    try {
      await deleteTodos(todoId);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (e) {
      setError('Unable to delete a todo');
    } finally {
      setDeletingTodoIds(prev => prev.filter(id => id !== todoId));

      if (newTodoFieldRef.current) {
        newTodoFieldRef.current.focus();
      }
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setDeletingTodoIds(prev => [
      ...prev,
      ...completedTodos.map(todo => todo.id),
    ]);

    try {
      let hasError = false;

      const deletePromises = completedTodos.map(async todo => {
        try {
          await deleteTodos(todo.id);

          return todo.id;
        } catch (e) {
          hasError = true;

          return null;
        }
      });

      const results = await Promise.all(deletePromises);

      const deletedIds = results.filter(id => id !== null) as number[];

      setTodos(prevTodos =>
        prevTodos.filter(todo => !deletedIds.includes(todo.id)),
      );

      if (hasError) {
        setError('Unable to delete a todo');
      }
    } finally {
      setDeletingTodoIds(prev =>
        prev.filter(id => !completedTodos.find(todo => todo.id === id)),
      );

      if (newTodoFieldRef.current) {
        newTodoFieldRef.current.focus();
      }
    }
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);
  const areAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={`todoapp__toggle-all ${areAllCompleted ? 'active' : ''}`}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleTodoSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={newTodoFieldRef}
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              disabled={isAddingTodo}
            />
          </form>
        </header>

        <TodoList
          todos={todos}
          filterStatus={filterStatus}
          isLoading={isLoading}
          onDelete={handleDeleteTodo}
          deletingTodoIds={deletingTodoIds}
          tempTodo={tempTodo}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodosCount} item${activeTodosCount !== 1 ? 's' : ''} left`}
            </span>

            {/* Active link should have the 'selected' class */}
            <TodoFilter
              filterStatus={filterStatus}
              onChange={setFilterStatus}
            />

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!hasCompletedTodos}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification onClose={hideErrorNotification} error={error} />
    </div>
  );
};
