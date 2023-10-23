/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { StatusFilter } from './types/Filter';
import * as todosServices from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { Header } from './components/Header/Header';

const USER_ID = 11587;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isloadingTodo, setIsLoadingTodo] = useState<number[]>([]);
  //  Этот массив отслеживает состояние загрузки для каждой
  //  задачи (TODO) в виде идентификаторов (id). По сути,
  //  это массив идентификаторов задач [1,2,3,4 итд].
  const [errorMessage, setErrorMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState(StatusFilter.ALL);
  const [title, setTitle] = useState('');
  const [statusResponse, setStatusResponse] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  function changeErrorMessage(message: string) {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  useEffect(() => {
    todosServices
      .getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        changeErrorMessage('Unable to load todos');
      });
  }, []);

  const filtredTodos: Todo[] = useMemo(() => {
    let filtered = [...todos];

    switch (statusFilter) {
      case StatusFilter.ACTIVE:
        filtered = filtered.filter((todo) => !todo.completed);
        break;

      case StatusFilter.COMPLETED:
        filtered = filtered.filter((todo) => todo.completed);
        break;

      default:
        break;
    }

    return filtered;
  }, [todos, statusFilter]);

  const addTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      changeErrorMessage('Title should not be empty');

      return;
    }

    const data = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...data,
    });

    setStatusResponse(true);

    todosServices
      .createTodo(data)
      .then((newTodo) => {
        setTitle('');
        setTodos((currentTodos) => [...currentTodos, newTodo]);
      })
      .catch(() => {
        changeErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setStatusResponse(false);
      });
  };

  const deleteTodo = (todoId: number) => {
    setIsLoadingTodo((currentTodo) => [...currentTodo, todoId]);

    todosServices
      .removeTodo(todoId)
      .then(() => setTodos(
        (currentTodo) => currentTodo.filter((todo) => todo.id !== todoId),
      ))
      .catch(() => changeErrorMessage('Unable to delete a todo'))
      .finally(() => setIsLoadingTodo(
        (currentTodo) => currentTodo.filter(
          (id: number) => id !== todoId,
        ),
      ));
    // убираем todoId из массива isLoadingTodo.
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          statusResponce={statusResponse}
          title={title}
          setTitle={setTitle}
          onHandleSubmit={addTodo}
        />

        {filtredTodos.length > 0 && (
          <>
            <TodoList
              todos={filtredTodos}
              deleteTodo={deleteTodo}
              isLoadingTodo={isloadingTodo}
              tempTodo={tempTodo}
            />

            {todos.length > 0 && (
              <TodoFooter
                todos={todos}
                setTodos={setTodos}
                filter={statusFilter}
                setFilter={setStatusFilter}
              />
            )}
          </>
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
