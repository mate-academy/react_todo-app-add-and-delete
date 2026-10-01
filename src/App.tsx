import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoError } from './components/TodoError';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      default:
        return true;
    }
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  const handleFilterChange = (nextFilter: Filter) => {
    setFilter(nextFilter);
  };

  const handleHideError = () => {
    setErrorMessage(null);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTodo);

    addTodo(trimmedTitle)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setDeletingTodoIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setDeletingTodoIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );

        inputRef.current?.focus();
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setDeletingTodoIds(completedIds);

    Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id))).then(
      results => {
        const successfullyDeletedIds = completedIds.filter(
          (_id, index) => results[index].status === 'fulfilled',
        );

        if (successfullyDeletedIds.length > 0) {
          setTodos(currentTodos =>
            currentTodos.filter(
              todo => !successfullyDeletedIds.includes(todo.id),
            ),
          );
        }

        if (results.some(result => result.status === 'rejected')) {
          setErrorMessage('Unable to delete a todo');
        }

        setDeletingTodoIds([]);
        inputRef.current?.focus();
      },
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleAddTodo}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={handleTitleChange}
              disabled={tempTodo !== null}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo !== null) && (
          <TodoList
            todos={visibleTodos}
            isLoading={isLoading}
            tempTodo={tempTodo}
            deletingTodoIds={deletingTodoIds}
            onDelete={handleDeleteTodo}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            filter={filter}
            activeTodosCount={activeTodosCount}
            hasCompletedTodos={hasCompletedTodos}
            onFilterChange={handleFilterChange}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <TodoError message={errorMessage || ''} onHide={handleHideError} />
    </div>
  );
};
