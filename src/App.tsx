/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './components/UserWarning/UserWarning';

import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './utils/filterTypes';

import { Header } from './components/Header/Header';
import { Loader } from './components/Loader/Loader';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';

const USER_ID = 6979;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);

  const loadTodos = async () => {
    setIsLoading(true);

    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setError('load');

      setTimeout(() => {
        setError('');
      }, 3000);

      setTodos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTodos = (allTodos: Todo[], filterMode: FilterType): Todo[] => {
    switch (filterMode) {
      case FilterType.Active:
        return allTodos.filter(todo => !todo.completed);

      case FilterType.Completed:
        return allTodos.filter(todo => todo.completed);

      default:
        return allTodos;
    }
  };

  const visibleTodos = filterTodos(todos, filterType);

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {isLoading && <Loader />}

        {!error && <TodoList todos={visibleTodos} />}

        {todos.length > 0 && (
          <Footer
            todos={visibleTodos}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
          />
        )}
      </div>

      <div className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
      >
        <button type="button" className="delete" />
        {`Unable to ${error} a todo`}
      </div>
    </div>
  );
};
