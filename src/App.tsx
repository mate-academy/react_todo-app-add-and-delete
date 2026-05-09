import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Filter } from './utils/Filter';
import { Todo } from './types/todo';
import { TodoList } from './components/TodoList';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorMessage } from './utils/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.Empty);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.Load);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage(ErrorMessage.Empty);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;

      case 'completed':
        return todo.completed;

      default:
        return true;
    }
  });

  const addTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
    setTempTodo({ id: 0, title, completed, userId });
    setIsLoading(true);

    todoService
      .createTodo({ title, completed, userId })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setQuery('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query.trim()) {
      setErrorMessage(ErrorMessage.TitleEmpty);

      return;
    }

    addTodo({
      title: query.trim(),
      completed: false,
      userId: todoService.USER_ID,
    });
  };

  const deleteTodo = (todoId: number) => {
    setLoadingIds(current => [...current, todoId]);

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
      })
      .finally(() => {
        setLoadingIds(current => current.filter(id => id !== todoId));
        inputRef.current?.focus();
      });
  };

  const handleFilterChange = (
    event: React.MouseEvent<HTMLAnchorElement>,
    value: Filter,
  ) => {
    event.preventDefault();
    setFilter(value);
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setLoadingIds(current => [
      ...current,
      ...completedTodos.map(todo => todo.id),
    ]);

    Promise.allSettled(
      completedTodos.map(todo => todoService.deleteTodo(todo.id)),
    ).then(results => {
      const failedInds = results.some(result => result.status === 'rejected');

      if (failedInds) {
        setErrorMessage(ErrorMessage.Delete);
      }

      const successfulIds = results
        .map((result, index) =>
          result.status === 'fulfilled' ? completedTodos[index].id : -1,
        )
        .filter(id => id !== -1);

      setTodos(current =>
        current.filter(todo => !successfulIds.includes(todo.id)),
      );

      inputRef.current?.focus();
    });
  };

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={filteredTodos}
          query={query}
          inputRef={inputRef}
          isLoading={isLoading}
          onQueryChange={setQuery}
          onSubmit={handleSubmit}
        />

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            loadingIds={loadingIds}
            onDelete={deleteTodo}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            filter={filter}
            onFilterChange={handleFilterChange}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage(ErrorMessage.Empty)}
      />
    </div>
  );
};
