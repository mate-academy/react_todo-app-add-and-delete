/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  changeTodo,
  deleteTodo,
  getTodos,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingId, setDeletingId] = useState(0);

  useEffect(() => {
    getTodos()
      .then(t => {
        setTodos(t);
      })
      .catch(err => {
        setError(true);
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setError(false);
        }, 3000);
        throw err;
      });
  }, []);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'ALL') {
      return todo;
    }

    if (filter === 'ACTIVE') {
      return !todo.completed;
    }

    if (filter === 'COMPLETED') {
      return todo.completed;
    }

    return;
  });

  const handleFilter = (type: 'ALL' | 'ACTIVE' | 'COMPLETED') => {
    setFilter(type);
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    inputRef: React.RefObject<HTMLInputElement>,
  ) => {
    event.preventDefault();

    if (query.trim().length === 0) {
      setError(true);
      setErrorMessage('Title should not be empty');
      setTimeout(() => setError(false), 3000);

      return;
    }

    const tempId = Date.now();

    const temporaryTodo: Todo & { temp?: boolean } = {
      id: tempId,
      userId: USER_ID,
      title: query.trim(),
      completed: false,
      temp: true,
    };

    setTempTodo(temporaryTodo);
    setLoading(true);

    addTodo({ ...temporaryTodo, id: 0 })
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setQuery('');
      })
      .catch(() => {
        setError(true);
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setError(false), 3000);

        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== tempId),
        );
      })
      .finally(() => {
        setTempTodo(null);
        setLoading(false);
      });

    inputRef.current?.blur();
  };

  const handleTodoComplete = (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    changeTodo(updatedTodo)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
        );
      })
      .catch(() => {
        setError(true);
        setErrorMessage('Unable to update a todo');
        setTimeout(() => {
          setError(false);
        }, 3000);
        setTodos(todos);
      });
  };

  const handleSubmitChangeTodo = (updatedTodo: Todo) => {
    return changeTodo(updatedTodo)
      .then(newTodo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(todo => todo.id === updatedTodo.id);

          newTodos.splice(index, 1, newTodo);

          return newTodos;
        });

        return newTodo;
      })
      .catch(() => {
        setError(true);
        setErrorMessage('Unable to update a todo');
        setTimeout(() => {
          setError(false);
        }, 3000);
        setTodos(todos);
        throw new Error('Unable to update a todo');
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setDeletingId(todoId);

    deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => {
        setError(true);
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => {
          setError(false);
        }, 3000);
        setTodos(todos);
      })
      .finally(() => setDeletingId(0));
  };

  const handleClearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    completedTodos.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
        })
        .catch(() => {
          setError(true);
          setErrorMessage(`Unable to delete a todo`);
          setTimeout(() => setError(false), 3000);
        });
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onSubmit={handleSubmit}
          query={query}
          onQuery={value => setQuery(value)}
          todos={todos}
          loading={loading}
        />

        <TodoList
          filteredTodos={filteredTodos}
          onTodoComplete={handleTodoComplete}
          onDeleteTodo={handleDeleteTodo}
          onSubmitChangeTodo={handleSubmitChangeTodo}
          deletingId={deletingId}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            onFilter={handleFilter}
            onClearCompletedTodos={handleClearCompletedTodos}
            activeTodos={todos.filter(todo => !todo.completed).length}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        error={error}
        onError={value => setError(value)}
        errorMessage={errorMessage}
      />
    </div>
  );
};
