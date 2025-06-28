/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodos, deleteTodos, getTodos, USER_ID } from './api/todos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorMessage } from './components/ErrorMessage';
import { Error } from './types/Error';
import { filterTodos } from './utils/filterTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState<Filter>(Filter.All);
  const [error, setError] = useState<Error | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number | null>(null);
  // #region LoadingTodo

  useEffect(() => {
    getTodos()
      .then(resolve => setTodos(resolve))
      .catch(() => setError(Error.UnableToLoadAll));
  }, []);

  const filteredTodos = useMemo(() => {
    return filterTodos(todos, filterStatus);
  }, [todos, filterStatus]);

  const itemsLeftCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const hasCompletedTodo = todos.some(todo => todo.completed);

  // #endregion

  // #region AddTodo
  const addTodo = useCallback((title: string) => {
    if (!title.trim()) {
      setError(Error.NoTitle);

      return;
    }

    const newTodo = {
      title: title.trim(),
      id: 0,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);
    setError(null);

    addTodos(newTodo)
      .then(res => setTodos(prev => [res, ...prev]))
      .catch(() => setError(Error.UnableToAdd))
      .finally(() => setTempTodo(null));
  }, []);
  // #endregion

  // #region DeleteTodo
  const deleteCurrentTodo = useCallback((id: number) => {
    setDeletingIds(id);
    deleteTodos(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => setError(Error.UnableToDelete))
      .finally(() => setDeletingIds(null));
  }, []);

  const deleteCompletedTodos = useCallback(() => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    Promise.all(completedTodoIds.map(id => deleteTodos(id)))
      .then(() => {
        setTodos(prev =>
          prev.filter(todo => !completedTodoIds.includes(todo.id)),
        );
      })
      .catch(() => {
        setError(Error.UnableToDelete);
      })
      .finally(() => {
        setDeletingIds(null);
      });
  }, [todos]);
  // #endregion

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header onAdd={addTodo} disabled={!!tempTodo} />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          deleteTodo={deleteCurrentTodo}
          deletingTodoId={deletingIds}
        />

        {!!todos.length && (
          <Footer
            activeCount={itemsLeftCount}
            currentFilter={filterStatus}
            setFilterStatus={setFilterStatus}
            hasCompletedTodo={hasCompletedTodo}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      <ErrorMessage error={error} close={() => setError(null)} />
    </div>
  );
};
