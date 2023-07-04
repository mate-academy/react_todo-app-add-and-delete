/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { getFilteredTodos } from './heplers/getFilteredTodos';
import { SortType } from './enum/SortType';
import { TodoHeader } from './components/TodoHeader';
import { TodoMain } from './components/TodoMain';
import { TodoFooter } from './components/TodoFooter';

const USER_ID = 10922;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortBy, setSortBy] = useState(SortType.All);

  const createTodo = useCallback((title: string): Promise<Todo> => {
    const body = {
      title,
      completed: false,
      userId: USER_ID,

    };

    return fetch('https://mate.academy/students-api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(body),
    })
      .then(response => response.json() as Promise<Todo>)
      .then(createdTodo => {
        setTodos(prevTodos => [...prevTodos, createdTodo]);

        return createdTodo;
      });
  }, []);

  const deleteTodo = useCallback((todoId: number): Promise<boolean> => {
    return fetch(`https://mate.academy/students-api/todos/${todoId}`, {
      method: 'DELETE',
    })
      .then(response => response.json()
        .then(result => {
          const isDeleted = Boolean(result);

          if (isDeleted) {
            setTodos(prevTodos => prevTodos.filter(
              todo => todo.id !== todoId,
            ));
          }

          return isDeleted;
        }));
  }, []);

  const updateStatus = useCallback(
    (todoId: number, newStatus: boolean): Promise<Todo> => {
      const body = {
        completed: newStatus,
      };

      return fetch(`https://mate.academy/students-api/todos/${todoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(body),
      })
        .then(response => response.json()
          .then(result => {
            const updatedStatus = result;

            setTodos(prevTodos => prevTodos.map(todo => {
              if (todo.id !== todoId) {
                return todo;
              }

              return updatedStatus;
            }));

            return updatedStatus;
          }));
    }, [],
  );

  useEffect(() => {
    getTodos(USER_ID)
      .then(data => setTodos(data));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSortType = (type: SortType) => {
    setSortBy(type);
  };

  const filters: string[] = [
    SortType.All,
    SortType.Active,
    SortType.Completed,
  ];

  const visibleTodos = getFilteredTodos(todos, sortBy);
  const amountCompletedTodos = visibleTodos.filter(
    todo => !todo.completed,
  ).length;
  const isVisibleClear = visibleTodos.every(todo => !todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          createTodo={createTodo}
        />

        <TodoMain
          todos={visibleTodos}
          onCheck={updateStatus}
          deleteTodo={deleteTodo}
        />
        <TodoFooter
          count={amountCompletedTodos}
          filters={filters}
          sortBy={sortBy}
          onSortType={handleSortType}
          isVisible={isVisibleClear}
        />
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        className="notification is-danger is-light
          has-text-weight-normal hidden"
      >
        <button type="button" className="delete" />

        {/* show only one message at a time */}
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo
      </div>
    </div>
  );
};
