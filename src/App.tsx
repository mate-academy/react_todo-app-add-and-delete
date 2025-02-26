/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoServices from './api/todos';
import { getTodos, USER_ID } from './api/todos';
import { TodoFooter } from './components/TodoFooter';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { TodoFilter } from './types/TodoFilter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<number | number[]>(0);

  // #region loadTodos
  const loadTodos = async () => {
    try {
      const loadedTodos = await getTodos();

      setTodos(loadedTodos);
    } catch {
      setError('Unable to load todos');
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (error !== '') {
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  }, [error]);

  // #endregion

  // #region filter
  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case TodoFilter.Active:
        return !todo.completed;
      case TodoFilter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  // #endregion

  // add todos
  const addTodo = async (newTodo: Todo) => {
    setLoading(true);

    setLoadingId(newTodo.id);
    try {
      const addedTodo: Todo[] = await todoServices.addTodo(newTodo);

      setTodos(prevTodos => [...prevTodos].concat(addedTodo));
    } finally {
      setTempTodo(null);
      setLoading(false);
    }
  };

  // delete todo
  const deleteTodo = async (id: number | number[]) => {
    setLoading(true);

    const ids = Array.isArray(id) ? id : [id];

    setLoadingId(ids);

    try {
      const deletePromise = ids.map(async i => {
        try {
          await todoServices.deleteTodo(i);

          return i;
        } catch {
          setError('Unable to delete a todo');

          return null;
        }
      });
      const results = await Promise.all(deletePromise);

      const successDelete = results.filter(result => result !== null);

      setTodos(todos.filter(todo => !successDelete.includes(todo.id)));
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async ({ title, id, completed }: Omit<Todo, 'userId'>) => {
    setLoading(true);
    setLoadingId(id);
    try {
      const updatedTodo = await todoServices.updatedTodo({
        title,
        id,
        completed,
      });

      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === id ? updatedTodo : todo)),
      );
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoading(false);
    }
  };

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

          <TodoForm
            todos={todos}
            onError={setError}
            onSubmit={addTodo}
            onTempTodo={setTempTodo}
            loading={loading}
          />
        </header>

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            onCompleted={updateTodo}
            tempTodo={tempTodo}
            onDelete={deleteTodo}
            loading={loading}
            loadingId={loadingId}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            completedTodos={completedTodos}
            filter={filter}
            onChange={setFilter}
            onDelete={deleteTodo}
            activeItems={todos.length - completedTodos.length}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};
