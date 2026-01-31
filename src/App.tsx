import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, deleteTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { TodoItem } from './components/TodoItem';
import { TodoFooter } from './components/TodoFooter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Status>(Status.All);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [error]);

  useEffect(() => {
    if (!tempTodo && deletingTodoIds.length === 0) {
      inputRef.current?.focus();
    }
  }, [tempTodo, deletingTodoIds]);

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

  const activeCount = todos.filter(todo => {
    return !todo.completed;
  }).length;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');

      return;
    }

    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    });

    addTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(current => {
          return [...current, newTodo];
        });
        setTitle('');
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDelete = (todoId: number) => {
    setDeletingTodoIds(ids => {
      return [...ids, todoId];
    });

    deleteTodo(todoId)
      .then(() => {
        setTodos(current => {
          return current.filter(t => {
            return t.id !== todoId;
          });
        });
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setDeletingTodoIds(ids => {
          return ids.filter(id => {
            return id !== todoId;
          });
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
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${todos.every(t => t.completed) ? 'active' : ''}`}
              data-cy="ToggleAllButton"
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => {
                setTitle(e.target.value);
              }}
              disabled={!!tempTodo}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={handleDelete}
                isLoading={deletingTodoIds.includes(todo.id)}
              />
            ))}

            {tempTodo && (
              <TodoItem todo={tempTodo} isLoading onDelete={() => {}} />
            )}
          </section>
        )}

        {todos.length > 0 && (
          <TodoFooter
            activeCount={activeCount}
            filter={filter}
            setFilter={setFilter}
            hasCompleted={todos.some(t => t.completed)}
            onClear={() => {
              todos.filter(t => t.completed).forEach(t => handleDelete(t.id));
            }}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!error ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            setError('');
          }}
        />
        {error}
      </div>
    </div>
  );
};
