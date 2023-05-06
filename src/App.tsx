import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { TodosList } from './components/TodosList';
import { Error } from './components/Error';
import { Footer } from './components/Footer';
import { FilterBy } from './utils/Enums/FilterBy';
import { Header } from './components/Header';
import { ErrorType } from './utils/Enums/ErrorType';

import { Todo } from './types/Todo';
import { FilterByType } from './types/FilterBy';

import { getTodos, post, remove } from './api/todos';

const USER_ID = 10217;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [query, setQuery] = useState<string>('');
  const [isQueryDisabled, setIsQueryDisabled] = useState<boolean>(false);
  const [filterBy, setFilterBy] = useState<FilterByType>(FilterBy.ALL);
  const [error, setError] = useState<ErrorType>(ErrorType.INITIAL);
  const [processedIds, setProcessedIds] = useState<number[]>([]);

  const loadData = () => {
    getTodos(USER_ID)
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => {
        setError(ErrorType.GET);
      });
  };

  const filteredTodos = useMemo(() => (
    todos.filter(todo => {
      switch (filterBy) {
        case FilterBy.ACTIVE:
          return !todo.completed;

        case FilterBy.COMPLETED:
          return todo.completed;

        default:
          return true;
      }
    })
  ), [todos, filterBy]);

  const isSomeTodoCompleted = useMemo(() => (
    todos.some(todo => todo.completed) || false
  ), [filteredTodos]);

  const isEveryTodoCompleted = useMemo(() => (
    filteredTodos.every(todo => todo.completed) || false
  ), [filteredTodos]);

  const counter = useMemo(() => (
    todos.filter(todo => !todo.completed).length || 0
  ), [filteredTodos]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsQueryDisabled(true);

    if (query.trim().length) {
      const newTodo = {
        userId: USER_ID,
        title: query,
        completed: false,
      };

      setTempTodo({ ...newTodo, id: 0 });

      try {
        await post(USER_ID, query);

        setQuery('');
        loadData();
      } catch (errorFromServer) {
        setError(ErrorType.POST);
      } finally {
        setTempTodo(null);
      }
    } else {
      setError(ErrorType.QUERY);
    }

    setIsQueryDisabled(false);
  };

  const handleRemove = async (todoId: number | number[]) => {
    try {
      if (typeof todoId === 'number') {
        setProcessedIds(currIds => [...currIds, todoId]);
        await remove(todoId);
      } else {
        setProcessedIds(todoId);
        await Promise.all(todoId.map(remove));
      }

      loadData();
    } catch (errorFromServer) {
      setError(ErrorType.DELETE);
    } finally {
      setProcessedIds(currIds => currIds.filter(id => id !== todoId));
    }
  };

  const handleErrorHide = () => {
    if (error !== ErrorType.GET && error !== ErrorType.INITIAL) {
      setError(ErrorType.INITIAL);
    }
  };

  const handleFilterButtonClick = (filterByType: FilterByType) => {
    setFilterBy(filterByType);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
  };

  const handleClear = () => {
    if (todos) {
      const idsOfCompletedTodos
        = todos.filter(todo => todo.completed).map(todo => todo.id);

      handleRemove(idsOfCompletedTodos);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          query={query}
          isQueryDisabled={isQueryDisabled}
          filteredTodosLength={filteredTodos.length}
          handleQueryChange={handleQueryChange}
          isEveryTodoCompleted={isEveryTodoCompleted}
          handleSubmit={handleSubmit}
        />

        <TodosList
          todos={filteredTodos}
          handleRemove={handleRemove}
          tempTodo={tempTodo}
          processedIds={processedIds}
        />

        {!!todos.length && (
          <Footer
            filterBy={filterBy}
            isSomeTodoCompleted={isSomeTodoCompleted}
            handleFilterButtonClick={handleFilterButtonClick}
            handleClear={handleClear}
            counter={counter}
          />
        )}
      </div>

      <div className={
        classNames('notification is-danger is-light has-text-weight-normal',
          { hidden: error === ErrorType.INITIAL })
      }
      >
        <Error
          error={error}
          handleErrorHide={handleErrorHide}
        />
      </div>
    </div>
  );
};
