/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo } from 'react';

import { ErrorNotification } from './components/ErrorNotification';
import { FooterMenu } from './components/FooterMenu';
import { ListOfTodos } from './components/ListOfTodos';
import { Header } from './components/Header';
import { UserWarning } from './UserWarning';

import { getTodos } from './api/todos';

import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { CustomError } from './types/CustomError';
import { ActiveTodoData } from './types/ActiveTodoData';

import { USER_ID } from './utils/fetchClient';
import { initData } from './constants/initData';
import { useError } from './utils/useError';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(initData.todos);
  const [filter, setFilter] = useState<Filter>(initData.filter);
  const [customError, setDelayError]
    = useError(initData.customError);
  const [activeTodoData, setActiveTodo]
    = useState<ActiveTodoData>(initData.activeTodoData);
  const [tempTodo, setTempTodo] = useState<Todo | null>(initData.tempTodo);

  const filterCallback = ((todo: Todo) => {
    switch (filter) {
      case Filter.Completed:
        return todo.completed;
      case Filter.Active:
        return !todo.completed;
      default:
        return true;
    }
  });

  useEffect(() => {
    getTodos(USER_ID)
      .then(todosFromServer => {
        setTodos(todosFromServer);
        setActiveTodo({
          hasActiveTodo: todosFromServer.some(todo => !todo.completed),
          activeLeft: todosFromServer.filter(todo => !todo.completed).length,
        });
      })
      .catch(() => {
        setDelayError(CustomError.update, 3000);
      });
  }, []);

  useEffect(() => {
    setActiveTodo({
      hasActiveTodo: !!todos.some(todo => !todo.completed),
      activeLeft: todos.filter(todo => !todo.completed).length,
    });
    setDelayError(CustomError.noError);
  }, [todos]);

  const filteredTodos = useMemo(
    () => todos.filter(filterCallback),
    [todos, filter],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          tempTodo={tempTodo}
          setTodos={setTodos}
          activeTodoData={activeTodoData}
          setTempTodo={setTempTodo}
          setError={setDelayError}
        />

        <ListOfTodos
          todos={filteredTodos}
          setTodos={setTodos}
          tempTodo={tempTodo}
          setError={setDelayError}
        />

        {!!todos.length && (
          <FooterMenu
            todos={filteredTodos}
            setTodos={setTodos}
            activeTodoData={activeTodoData}
            filter={filter}
            setFilter={setFilter}
            setError={setDelayError}
          />
        )}
      </div>

      {customError && (
        <ErrorNotification
          customError={customError}
          setError={setDelayError}
        />
      )}
    </div>
  );
};
