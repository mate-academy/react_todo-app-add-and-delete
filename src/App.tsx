/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { addTodo, changeTodo, deleteTodo, getTodos } from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotifications';

const USER_ID = 3227;

export enum Filter {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingId, setDeletingId] = useState<number[]>([]);

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
    if (filter === Filter.ALL) {
      return todo;
    }

    if (filter === Filter.ACTIVE) {
      return !todo.completed;
    }

    if (filter === Filter.COMPLETED) {
      return todo.completed;
    }

    return;
  });

  const handleFilter = (type: Filter) => {
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

  const handleSubmitChangeTodo = (updatedTodo: Todo): Promise<Todo> => {
    if (updatedTodo.title.trim().length === 0) {
      setTodos(currentTodos =>
        currentTodos.filter(todo => todo.id !== updatedTodo.id),
      );

      return Promise.resolve(updatedTodo);
    }

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
        setTimeout(() => setError(false), 3000);
        setTodos(todos);
        throw new Error('Unable to update a todo');
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setDeletingId(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setError(true);
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setError(false), 3000);
      })
      .finally(() => {
        setDeletingId(prev => prev.filter(id => id !== todoId));
      });
  };

  const handleClearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setDeletingId(current => [...current, ...completedTodos.map(t => t.id)]);

    Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id).then(() => todo.id)),
    ).then(results => {
      const successfulIds: number[] = [];
      let hasError = false;

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          successfulIds.push(result.value);
        } else {
          hasError = true;
        }
      });

      setTodos(currentTodos =>
        currentTodos.filter(todo => !successfulIds.includes(todo.id)),
      );

      if (hasError) {
        setError(true);
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setError(false), 3000);
      }

      setDeletingId(current =>
        current.filter(id => !completedTodos.map(t => t.id).includes(id)),
      );
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>
        <div className="todoapp__content">
          <TodoHeader
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
            <TodoFooter
              todos={todos}
              filter={filter}
              onFilter={handleFilter}
              onClearCompletedTodos={handleClearCompletedTodos}
              activeTodos={todos.filter(todo => !todo.completed).length}
            />
          )}
        </div>

        <ErrorNotification
          error={error}
          onError={value => setError(value)}
          errorMessage={errorMessage}
        />
      </div>
    </>
  );
};
