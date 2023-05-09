/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Select } from './types/Select';
import { getTodos } from './api/todos';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { Errors } from './types/Errors';
import { Header } from './components/Header';

export const USER_ID = 9960;

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[] | null>(null);
  const [selectedFilter, setSelectedFilter] = useState(Select.ALL);
  const [typeError, setTypeError] = useState<Errors | null>(null);
  const [notificationError, setNotificationError] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadersTodosId, setLoadersTodoId] = useState<number[] | null>(null);

  const filteringList = useMemo(() => {
    const filter = todoList && todoList.filter((todo) => {
      switch (selectedFilter) {
        case Select.ACTIVE:
          return !todo.completed;
        case Select.COMPLETED:
          return todo.completed;
        default:
          return true;
      }
    });

    return filter;
  }, [selectedFilter, todoList]);

  const countItemLeft = () => {
    let count = 0;

    todoList?.forEach(todo => {
      if (!todo.completed) {
        count += 1;
      }
    });

    return count;
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodoList)
      .catch(() => {
        setTypeError(Errors.UPDATE);
        setNotificationError(true);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          USER_ID={USER_ID}
          counterItemLeft={countItemLeft}
          setTypeError={setTypeError}
          setNotificationError={setNotificationError}
          todoList={todoList}
          setTempTodo={setTempTodo}
          setTodoList={setTodoList}
        />

        {todoList && (
          <>
            <Main
              filteringList={filteringList}
              setTypeError={setTypeError}
              setNotificationError={setNotificationError}
              tempTodo={tempTodo}
              todoList={todoList}
              setTodoList={setTodoList}
              loadersTodosId={loadersTodosId}
            />
          </>
        )}

        {(todoList?.length !== 0 && todoList) && (
          <Footer
            countItemLeft={countItemLeft}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            todoList={todoList}
            setTodoList={setTodoList}
            setTypeError={setTypeError}
            setNotificationError={setNotificationError}
            setLoadersTodoId={setLoadersTodoId}
          />
        )}

      </div>

      <Notification
        typeError={typeError}
        setNotificationError={setNotificationError}
        notificationError={notificationError}
      />
    </div>
  );
};
