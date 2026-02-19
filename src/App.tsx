/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
// #region import
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { TodoList } from './components/TodoList';
import { Header } from './components/Heder';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
// #endregion

export const App: React.FC = () => {
  // #region state, ref
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<FilterStatus>(FilterStatus.All);

  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const newTodoField = useRef<HTMLInputElement>(null);
  // #endregion
  // #region computed values
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.some(todo => todo.completed);
  const filters = Object.values(FilterStatus);

  const filteredTodos = useCallback(
    (list: Todo[]) => {
      let result = [...list];

      if (status === 'Active') {
        result = result.filter(t => !t.completed);
      } else if (status === 'Completed') {
        result = result.filter(t => t.completed);
      }

      return result;
    },
    [status],
  );

  const visibleTodos = useMemo(() => {
    return filteredTodos(todos);
  }, [filteredTodos, todos]);
  // #endregion
  // #region efftcts

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (error !== '') {
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  }, [error]);

  useEffect(() => {
    if (!tempTodo && newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [tempTodo, todos]);
  // #endregion
  // #region handle
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setError('Title should not be empty');

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: normalizedTitle,
      completed: false,
    });

    createTodo(normalizedTitle)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
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
    setLoadingIds(ids => [...ids, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => {
          return currentTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingIds(ids => ids.filter(id => id !== todoId));
      });
  };

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDelete(todo.id);
      }
    });
  };
  // #endregion

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onSubmit={handleSubmit}
          newTodoField={newTodoField}
          title={title}
          setTitle={setTitle}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              visibleTodos={visibleTodos}
              onDelete={handleDelete}
              loadingIds={loadingIds}
              tempTodo={tempTodo}
            />
            <Footer
              activeCount={activeCount}
              filters={filters}
              status={status}
              setStatus={setStatus}
              completedCount={completedCount}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
