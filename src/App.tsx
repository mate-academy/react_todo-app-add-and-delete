/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';

export enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

enum ErrorMessage {
  Load = 'Unable to load todos',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  EmptyTitle = 'Title should not be empty',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = title.trim();

    if (!trimmed) {
      return setErrorMessage(ErrorMessage.EmptyTitle);
    }

    const id = Date.now();
    const fakeTodo: Todo = {
      id,
      userId: USER_ID,
      title: trimmed,
      completed: false,
    };

    setTempTodo(fakeTodo);
    setIsLoading(true);

    addTodo(trimmed)
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTitle('');
        setTempTodo(null);
      })
      .catch(() => setErrorMessage(ErrorMessage.Add))
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMessage]);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.Load))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos]);

  useEffect(() => {
    if (errorMessage === ErrorMessage.Add) {
      inputRef.current?.focus();
    }
  }, [errorMessage]);

  const handleDelete = (todoId: number) => {
    setDeletingTodoIds(prev => [...prev, todoId]);
    deleteTodo(todoId)
      .then(() => setTodos(prev => prev.filter(t => t.id !== todoId)))
      .catch(() => setErrorMessage(ErrorMessage.Delete))
      .finally(() => {
        setDeletingTodoIds(prev => prev.filter(id => id !== todoId));
        setIsLoading(false);
      });
  };

  const handleClearCompleted = () => {
    const completed = todos.filter(t => t.completed);

    if (completed.length === 0) {
      return;
    }

    Promise.allSettled(completed.map(t => deleteTodo(t.id))).then(results => {
      const successfulIds = results
        .map((result, index) =>
          result.status === 'fulfilled' ? completed[index].id : null,
        )
        .filter((id): id is number => id !== null);

      setTodos(prev => prev.filter(t => !successfulIds.includes(t.id)));

      if (results.some(r => r.status === 'rejected')) {
        setErrorMessage(ErrorMessage.Delete);
      }
    });
  };

  const handleFilterChange = (newFilter: Filter) => {
    setFilter(newFilter);
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleToggle = (id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleUpdate = (id: number, newTitle: string) => {
    setTodos(prev =>
      prev.map(todo => (todo.id === id ? { ...todo, title: newTitle } : todo)),
    );
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          handleSubmit={handleSubmit}
          inputRef={inputRef}
          isLoading={isLoading}
          allCompleted={todos.every(t => t.completed)}
        />

        <TodoList
          todos={filteredTodos}
          onDelete={handleDelete}
          isLoading={isLoading}
          tempTodo={tempTodo}
          onToggle={handleToggle}
          onUpdate={handleUpdate}
          deletingTodoIds={deletingTodoIds}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            onFilterChange={handleFilterChange}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
