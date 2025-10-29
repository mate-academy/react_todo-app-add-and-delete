/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, postTodo, USER_ID } from './api/todos';
import { Filter } from './components/Filter';
import { Filters } from './constants/filter';
import { TodoList } from './components/TodoList';
import { NewTodo } from './components/NewTodo';
import { Todo } from './types/Todo';
import { TodoComp } from './components/TodoComp';

const getPreparedTodos = (todos: Todo[], filter: Filters) => {
  const newTodos = [...todos];

  switch (filter) {
    case Filters.Active:
      return newTodos.filter(todo => todo.completed === false);
    case Filters.Completed:
      return newTodos.filter(todo => todo.completed === true);
    default:
      return newTodos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<Filters>(Filters.All);
  const [loading, setLoading] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    setError('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    const input =
      document.querySelector<HTMLInputElement>('.todoapp__new-todo');

    if (input) {
      input.focus();
    }
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const preparedTodos: Todo[] = getPreparedTodos(todos, filter);

  const activeTodos = todos.filter(todo => !todo.completed);

  const completedTodos = todos.filter(todo => todo.completed);

  const handleAddTodo = async (title: string) => {
    const newTodo = {
      title,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({ ...newTodo, id: 0 });

    try {
      const createdTodo = await postTodo(newTodo);

      setTodos(prev => [...prev, createdTodo]);
    } catch {
      setError('Unable to add a todo');
      throw new Error();
    } finally {
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = (id: number) => {
    setLoadingTodoIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() =>
        setLoadingTodoIds(prev => prev.filter(loadingId => loadingId !== id)),
      );
  };

  const handleDeleteCompletedTodos = () => {
    const idsToDelete = completedTodos.map(todo => todo.id);

    setLoadingTodoIds(prev => [...prev, ...idsToDelete]);

    Promise.allSettled(idsToDelete.map(id => deleteTodo(id)))
      .then(results => {
        const successfulIds = idsToDelete.filter(
          (_, i) => results[i].status === 'fulfilled',
        );

        setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));

        const hasErrors = results.some(r => r.status === 'rejected');

        if (hasErrors) {
          setError('Unable to delete a todo');
        }
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(id => !idsToDelete.includes(id)));
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: completedTodos.length === preparedTodos.length,
            })}
            data-cy="ToggleAllButton"
          />

          <NewTodo onSetError={setError} onAddTodo={handleAddTodo} />
        </header>

        <TodoList
          todos={preparedTodos}
          isLoading={loading}
          onDeleteTodo={handleDeleteTodo}
          loadingTodoIds={loadingTodoIds}
        />

        {tempTodo && (
          <TodoComp
            todo={tempTodo}
            isLoading={true}
            onDeleteTodo={handleDeleteTodo}
          />
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodos.length} items left`}
            </span>

            <Filter filter={filter} onSetFilter={setFilter} />
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedTodos.length === 0}
              onClick={handleDeleteCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: error === '' },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
        {/* Unable to update a todo */}
      </div>
    </div>
  );
};
