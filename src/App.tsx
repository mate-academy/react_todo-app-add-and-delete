/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, deleteTodo, addNewTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { TodoList } from './components/TodoList';
import { NewTodo } from './components/NewTodo';
import { Filter } from './components/Filter';
import { StatusFilter } from './types/StatusFilter';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    StatusFilter.ALL,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processings, setProcessings] = useState<Set<number>>(new Set());
  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }

    setError(null);
    setLoading(true);
    getTodos()
      .then(todosList => setTodos(todosList))
      .catch(() => setError(ErrorMessage.NO_TODOS))
      .finally(() => setLoading(false));
  }, []);

  const handleFilter = () => {
    switch (statusFilter) {
      case StatusFilter.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case StatusFilter.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const onErrorClose = useCallback(() => setError(null), []);

  const handleTodoDelete = (todoId: number) => {
    setProcessings(prev => {
      const newSet = new Set(prev);

      newSet.add(todoId);

      return newSet;
    });

    return deleteTodo(todoId)
      .then(() =>
        setTodos(currentList => currentList.filter(todo => todo.id !== todoId)),
      )
      .catch(() => setError(ErrorMessage.UNABLE_DELETE))
      .finally(() => {
        setProcessings(prev => {
          const newSet = new Set(prev);

          newSet.delete(todoId);

          return newSet;
        });
        inputField.current?.focus();
      });
  };

  const handleTodoAdd = (todo: Todo) => {
    setProcessings(prev => {
      const newSet = new Set(prev);

      newSet.add(0);

      return newSet;
    });
    setTempTodo(todo);

    return addNewTodo(todo)
      .then((newTodo: Todo) => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(err => {
        setError(ErrorMessage.UNABLE_ADD);
        throw err;
      })
      .finally(() => {
        setProcessings(prev => {
          const newSet = new Set(prev);

          newSet.delete(0);

          return newSet;
        });
        setTempTodo(null);
        setTimeout(() => inputField.current?.focus(), 0);
      });
  };

  const handleCompleted = async () => {
    const ids = todos.filter(todo => todo.completed).map(todo => todo.id);

    if (ids.length === 0) {
      return;
    }

    setProcessings(prev => {
      const newSet = new Set(prev);

      ids.forEach(id => newSet.add(id));

      return newSet;
    });

    const promises = ids.map(id => {
      return deleteTodo(id);
    });

    const results = await Promise.allSettled(promises);
    const successfulIds = ids.filter(
      (_, i) => results[i].status === 'fulfilled',
    );

    if (results.some(result => result.status === 'rejected')) {
      setError(ErrorMessage.UNABLE_DELETE);
    }

    if (successfulIds.length > 0) {
      setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));
    }

    setProcessings(prev => {
      const newSet = new Set(prev);

      ids.forEach(id => newSet.delete(id));

      return newSet;
    });
    inputField.current?.focus();
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
              className={classNames('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
            />
          )}

          <NewTodo
            setFormError={setError}
            inputField={inputField}
            onFormSubmit={handleTodoAdd}
            processings={processings}
          />
        </header>

        {todos.length > 0 && !loading && (
          <>
            <TodoList
              todosList={handleFilter()}
              handleTodoDelete={handleTodoDelete}
              tempTodo={tempTodo}
              processings={processings}
            />

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {todos.filter(todo => !todo.completed).length + ' items left'}
              </span>

              <Filter
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={!todos.some(todo => todo.completed)}
                onClick={handleCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <ErrorNotification error={error} handleErrorClose={onErrorClose} />
    </div>
  );
};
