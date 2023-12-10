/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import cn from 'classnames';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';
import { getTodos } from './api/todos';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoItem } from './components/TodoItem/TodoItem';
import { Footer } from './components/TodoFooter/TodoFooter';
// import { Error } from './components/TodoError/TodoError';

const USER_ID = 11859;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean | number>(false);
  const [todosError, setTodosError] = useState(ErrorMessage.Default);
  const [filter, setFilter] = useState(Filter.All);
  const [tempTodos, setTempTodos] = useState<Todo | null>(null);
  const [isHidden, setIsHidden] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const fetchedTodos = await getTodos(USER_ID);

      setTodos(fetchedTodos);
    } catch (error) {
      setTimeout(() => {
        setTodosError(ErrorMessage.UnableToLoadTodos);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setTimeout(() => {
      setIsHidden(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [setIsHidden]);

  const filteredTodos = useMemo(() => (
    todos.filter(todo => {
      switch (filter) {
        case Filter.Active:
          return !todo.completed;

        case Filter.Completed:
          return todo.completed;

        case Filter.All:
        default:
          return true;
      }
    })
  ), [filter, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={filteredTodos}
          setTodos={setTodos}
          setTodosError={setTodosError}
          tempTodos={tempTodos}
          setTempTodos={setTempTodos}
        />
        <TodoItem
          todos={filteredTodos}
          setTodos={setTodos}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setTodosError={setTodosError}
          tempTodos={tempTodos}
        />
        {todos.length > 0 && (
          <Footer
            todos={todos}
            todosArray={todos}
            setFilter={setFilter}
            filter={filter}
            setTodos={setTodos}
            setTodosError={setTodosError}
          />
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: isHidden },
        )}
      >
        {/* eslint-disable jsx-a11y/control-has-associated-label  */}
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            setIsHidden(true);
          }}
        />
        {todosError}
      </div>
    </div>
  );
};
