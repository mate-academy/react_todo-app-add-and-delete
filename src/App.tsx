import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { TodosList } from './components/TodosList';
import { Error } from './components/Error';
import { Footer } from './components/Footer';
import { FilterBy } from './utils/Enums/FilterBy';
import { Header } from './components/Header';
import { ErrorType } from './utils/Enums/ErrorType';
import { Loader } from './components/Loader';

import { Todo } from './types/Todo';
import { FilterByType } from './types/FilterBy';

import { getTodos, post, remove } from './api/todos';

const USER_ID = 10217;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo[]>([]);
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isQueryDisabled, setIsQueryDisabled] = useState<boolean>(false);
  const [filterBy, setFilterBy] = useState<FilterByType>(FilterBy.ALL);
  const [error, setError] = useState<ErrorType>(ErrorType.INITIAL);

  const loadData = () => {
    setIsLoading(true);
    getTodos(USER_ID)
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => {
        setError(ErrorType.GET);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTodos = useMemo(() => (
    todos?.filter(todo => {
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
    todos?.some(todo => todo.completed) || false
  ), [filteredTodos]);

  const isEveryTodoCompleted = useMemo(() => (
    filteredTodos?.every(todo => todo.completed) || false
  ), [filteredTodos]);

  const counter = useMemo(() => (
    todos?.filter(todo => !todo.completed).length || 0
  ), [filteredTodos]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQuery('');
    setIsQueryDisabled(true);

    if (query.trim().length) {
      try {
        const newTodo = await post(USER_ID, query);

        loadData();
        setTempTodo([...tempTodo, { ...newTodo, id: 0 }]);
      } catch (errorFromServer) {
        setError(ErrorType.POST);
      }
    } else {
      setError(ErrorType.QUERY);
    }

    setIsQueryDisabled(false);
  };

  const handleRemove = async (id: number | number[]) => {
    try {
      if (typeof id === 'number') {
        await remove(id);
      } else {
        await Promise.all(id.map(remove));
      }

      loadData();
    } catch (errorFromServer) {
      setError(ErrorType.DELETE);
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
      const idOfCompletedTodos
        = todos.filter(todo => todo.completed).map(todo => todo.id);

      handleRemove(idOfCompletedTodos);
    }
  };

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
          filteredTodosLength={filteredTodos?.length}
          handleQueryChange={handleQueryChange}
          isEveryTodoCompleted={isEveryTodoCompleted}
          handleSubmit={handleSubmit}
        />

        {isLoading ? (
          (!error) && (
            <Loader />
          )
        ) : (
          (filteredTodos && (
            <TodosList
              todos={filteredTodos}
              handleRemove={handleRemove}
            />
          ))
        )}

        {!!todos?.length && (
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
