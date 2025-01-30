import React, { useEffect, useMemo, useState } from 'react';

import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, createTodo, deleteTodo } from './api/todos';

import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { ErrorMessages } from './types/ErrorMessages';

import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<keyof typeof ErrorMessages>('Empty');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAllCompleted, setIsAllCompleted] = useState(
    todos.every(todo => todo.completed === true),
  );
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case FilterType.Active:
          return !todo.completed;
        case FilterType.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filter]);

  const uncompletedTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError('Load'));
  }, []);

  useEffect(() => {
    setIsAllCompleted(todos.every(todo => todo.completed));
  }, [todos]);

  useEffect(() => {
    if (error !== 'Empty') {
      const timer = setTimeout(() => {
        setError('Empty');
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleFilter = (newFilter: FilterType) => setFilter(newFilter);

  const handleAllTodoCompleted = () => {
    setTodos(prevTodos =>
      prevTodos.map(todo => ({ ...todo, completed: !isAllCompleted })),
    );
  };

  const handleAddTodo = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setError('EmptyTitle');

      return;
    }

    setTempTodo({
      userId: USER_ID,
      id: 0,
      title: trimmedQuery,
      completed: false,
    });

    createTodo({ userId: USER_ID, title: trimmedQuery, completed: false })
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setQuery('');
      })
      .catch(() => {
        setError('Add');
      })
      .finally(() => setTempTodo(null));
  };

  const handleDeleteTodo = (id: number) => {
    setLoadingTodoId(id);

    return deleteTodo(id)
      .then(() =>
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id)),
      )
      .catch(err => {
        setError('Delete');
        throw err;
      })
      .finally(() => setLoadingTodoId(null));
  };

  const handleClearCompletedTodos = () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    Promise.all(completedTodoIds.map(handleDeleteTodo)).then(() =>
      setTodos(prevTodos =>
        prevTodos.filter(todo => !completedTodoIds.includes(todo.id)),
      ),
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosCount={todos.length}
          isTempTodo={!!tempTodo}
          isAllCompleted={isAllCompleted}
          query={query}
          setQuery={setQuery}
          setError={setError}
          handleAllTodoCompleted={handleAllTodoCompleted}
          handleAddTodo={handleAddTodo}
        />

        {todos && (
          <TodoList
            todos={[...filteredTodos, ...(tempTodo ? [tempTodo] : [])]}
            setTodos={setTodos}
            handleDeleteTodo={handleDeleteTodo}
            loadingTodoId={loadingTodoId}
          />
        )}

        {todos.length > 0 && (
          <Footer
            uncompletedTodosCount={uncompletedTodosCount}
            filter={filter}
            handleFilter={handleFilter}
            handleClearCompletedTodos={handleClearCompletedTodos}
            hasCompletedTodos={todos.length !== uncompletedTodosCount}
          />
        )}
      </div>

      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
