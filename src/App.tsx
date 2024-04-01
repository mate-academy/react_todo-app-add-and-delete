/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useCallback, useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { FilterOptions } from './types/FilterOptions';
import { Errors } from './types/Errors';
import { TodoApp } from './components/TodoApp';
import { TodoList } from './components/TodoList';
import { TodosFilter } from './components/TodosFilter';
import { TodoError } from './components/TodoError';
import { getTodos } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterOption, setFilterOption] = useState<FilterOptions>(
    FilterOptions.all,
  );
  const [errorText, setErrorText] = useState<Errors | null>(null);
  const [errorTimeOutId, setErrorTimeOutId] = useState<number>(0);
  const [isCompletedTodosDeleting, setIsCompletedTodosDeleting] =
    useState<boolean>(false);

  const clearTimeoutError = useCallback((): void => {
    if (errorTimeOutId) {
      window.clearInterval(errorTimeOutId);
    }

    setErrorTimeOutId(window.setTimeout(() => setErrorText(null), 3000));
  }, [errorTimeOutId]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorText(Errors.unableToLoad);
        clearTimeoutError();
      });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoApp
          todos={todos}
          updateTodos={setTodos}
          addTempTodo={setTempTodo}
          errorText={errorText}
          addErrorText={setErrorText}
          clearTimeoutError={clearTimeoutError}
        />
        <TodoList
          todos={todos}
          updateTodos={setTodos}
          tempTodo={tempTodo}
          filterOption={filterOption}
          errorText={errorText}
          addErrorText={setErrorText}
          clearTimeoutError={clearTimeoutError}
          isCompletedTodosDeleting={isCompletedTodosDeleting}
        />
        {!!todos.length && (
          <TodosFilter
            todos={todos}
            updateTodos={setTodos}
            filterOption={filterOption}
            selectFilterOption={setFilterOption}
            errorText={errorText}
            addErrorText={setErrorText}
            clearTimeoutError={clearTimeoutError}
            selectIsCompletedTodosDeleting={setIsCompletedTodosDeleting}
          />
        )}
      </div>

      <TodoError errorText={errorText} addErrorText={setErrorText} />
    </div>
  );
};
