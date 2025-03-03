/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  apiAddTodo,
  deleteTodo,
  getTodos,
  patchTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './Components/Header';
import { TodoList } from './Components/TodoList';
import { Footer } from './Components/Footer';
import { FilterType } from './types/FilterType';
import { ErrorNotification } from './Components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setLoading(true);
    getTodos()
      .then(data => {
        setTodos(data);
        setError(null);
      })
      .catch(() => {
        setError('Unable to load todos');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === FilterType.Active) {
      return !todo.completed;
    }

    if (filter === FilterType.Completed) {
      return todo.completed;
    }

    return true;
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  const hasCompleted = todos.some(todo => todo.completed);

  const onClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id))).then(
      results => {
        const failedIds = completedTodos
          .filter((_, index) => results[index].status === 'rejected')
          .map(todo => todo.id);

        setTodos(prev =>
          prev.filter(todo => !todo.completed || failedIds.includes(todo.id)),
        );

        if (failedIds.length > 0) {
          setError('Unable to delete a todo');
        }
      },
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');

      return;
    }

    const temp: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(temp);
    setLoading(true);
    setError(null);

    apiAddTodo({
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setLoading(false);
      });
  };

  const handleDelete = (id: Todo['id']) => {
    setDeletingTodoIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setDeletingTodoIds(prev =>
          prev.filter(deletingId => deletingId !== id),
        );
      });
  };

  const toggleTodo = (id: number) => {
    const currentTodo = todos.find(todo => todo.id === id);

    if (!currentTodo) {
      return;
    }

    patchTodo(id, { completed: !currentTodo.completed })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === id
              ? { ...todo, completed: updatedTodo.completed }
              : todo,
          ),
        );
      })
      .catch(() => {
        setError('Failed to update todo');
      });
  };

  const onToggleAll = () => {
    setTodos(prevTodos => {
      const allCompleted = prevTodos.every(todo => todo.completed);

      return prevTodos.map(todo => ({
        ...todo,
        completed: !allCompleted,
      }));
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <ErrorNotification
        error={error}
        isVisible={!!error}
        onClose={() => setError(null)}
      />

      <div className="todoapp__content">
        <Header
          todos={todos}
          title={title}
          setTitle={setTitle}
          setError={setError}
          handleSubmit={handleSubmit}
          onToggleAll={onToggleAll}
          loading={loading}
          inputRef={inputRef}
        />
        {todos.length > 0 && (
          <TodoList
            filteredTodos={filteredTodos}
            onDelete={handleDelete}
            onToggle={toggleTodo}
            tempTodo={tempTodo}
            deletingTodoIds={deletingTodoIds}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            filter={filter}
            hasCompleted={hasCompleted}
            handleFilterChange={handleFilterChange}
            onClearCompleted={onClearCompleted}
          />
        )}
      </div>
    </div>
  );
};
