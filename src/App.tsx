/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorMessage, Status } from './types/Enum';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.None,
  );

  const [filter, setFilter] = useState<Status>(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const todoFieldRef = React.useRef<HTMLInputElement>(null);

  const addTodo = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.Title);
      setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);
      todoFieldRef.current?.focus();

      return;
    }

    setIsLoading(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    createTodo({
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);
        setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);

        setTimeout(() => {
          todoFieldRef.current?.focus();
        }, 0);
      });
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.Load);
        setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);
      });
  }, []);

  const removeTodo = (todoId: number) => {
    setLoadingIds(prev => [...prev, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(error => {
        setErrorMessage(ErrorMessage.Delete);
        setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);
        throw error;
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todoId));

        setTimeout(() => {
          todoFieldRef.current?.focus();
        }, 0);
      });
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const deletePromises = completedTodos.map(todo => removeTodo(todo.id));

    Promise.allSettled(deletePromises);
  };

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === Status.Active) {
        return !todo.completed;
      }

      if (filter === Status.Completed) {
        return todo.completed;
      }

      return true;
    });
  }, [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const activeCount = todos.filter(t => !t.completed).length;
  const hasCompleted = todos.some(t => t.completed);
  const isAllCompleted = todos.length > 0 && todos.every(t => t.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: isAllCompleted,
            })}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={addTodo}>
            <input
              ref={todoFieldRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            loadingIds={loadingIds}
            onDelete={removeTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            currentFilter={filter}
            onFilterChange={setFilter}
            hasCompleted={hasCompleted}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage(ErrorMessage.None)}
      />
    </div>
  );
};
