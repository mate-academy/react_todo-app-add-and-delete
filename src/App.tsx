/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodos, deleteTodos, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessages } from './types/ErrorMessages';

export type FilterType = 'All' | 'Active' | 'Completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('All');
  const notCompletedCount = todos.filter(todo => !todo.completed).length;
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  function getFilteredTodos(allTodos: Todo[], status: FilterType) {
    switch (status) {
      case 'Active':
        return allTodos.filter(todo => !todo.completed);
      case 'Completed':
        return allTodos.filter(todo => todo.completed);
      default:
        return allTodos;
    }
  }

  const visibleTodos = getFilteredTodos(todos, filter);
  const showErrorMessage = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
  };

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => showErrorMessage(ErrorMessages.LOAD));
    newTodoField.current?.focus();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleDelete = (todoId: number) => {
    setDeletingId(todoId);
    deleteTodos(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => showErrorMessage(ErrorMessages.DELETE))
      .finally(() => {
        setDeletingId(null);
        setTimeout(() => {
          newTodoField.current?.focus();
        }, 0);
      });
  };

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    const title = newTodoField.current?.value.trim();

    if (!title) {
      showErrorMessage(ErrorMessages.TITLE);

      return;
    }

    const newTodo = {
      title,
      completed: false,
      userId: USER_ID,
    };

    setIsLoading(true);
    setTempTodo({ ...newTodo, id: 0 });

    addTodos(newTodo)
      .then(response => {
        setTodos(prev => [...prev, response]);
        newTodoField.current!.value = '';
      })
      .catch(() => showErrorMessage(ErrorMessages.ADD))
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
        setTimeout(() => {
          newTodoField.current?.focus();
        }, 0);
      });
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodos(todo.id)),
    );

    const deletedIds = completedTodos
      .map((todo, i) => (results[i].status === 'fulfilled' ? todo.id : null))
      .filter(id => id !== null);

    setTodos(todos.filter(todo => !deletedIds.includes(todo.id)));

    if (results.some(r => r.status === 'rejected')) {
      showErrorMessage(ErrorMessages.DELETE);
    }

    setTimeout(() => {
      newTodoField.current?.focus();
    }, 0);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', 'active')}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleAdd}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={newTodoField}
              disabled={isLoading}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              onDelete={handleDelete}
              tempTodo={tempTodo}
              isLoading={isLoading}
              deletingId={deletingId}
            />
            <Footer
              notCompletedCount={notCompletedCount}
              filter={filter}
              setFilter={setFilter}
              totalTodos={todos.length}
              handleClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {error}
      </div>
    </div>
  );
};
