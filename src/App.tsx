import React, { useEffect, useMemo, useState } from 'react';
import { TodoHeader } from './Components/TodoHeader';
import { TodoMain } from './Components/TodoMain';
import { TodoFooter } from './Components/TodoFooter';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { ErrorNotification } from './Components/ErrorNotification';
import { Filter } from './types/Filter';
import { ErrorStatus } from './types/ErrorStatus';
import { USER_ID } from './utils/constants';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterType, setFilterType] = useState(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [completedIds, setCompletedIds] = useState<number[] | []>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorStatus.Load);
      });
  }, []);

  const preparedTodos = useMemo(() => {
    const todosCopy = [...todos]
      .filter((todo) => {
        switch (filterType) {
          case Filter.Active: return !todo.completed;
          case Filter.Completed: return todo.completed;
          default: return todo;
        }
      });

    return todosCopy;
  }, [todos, filterType]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={preparedTodos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
        />

        {todos && (
          <TodoMain
            todos={preparedTodos}
            tempTodo={tempTodo}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            loading={loading}
            completedIds={completedIds}
            setCompletedIds={setCompletedIds}
          />
        )}

        {todos && (
          <TodoFooter
            filterType={filterType}
            setFilterType={setFilterType}
            todos={todos}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            setLoading={setLoading}
            setCompletedIds={setCompletedIds}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />

    </div>
  );
};
