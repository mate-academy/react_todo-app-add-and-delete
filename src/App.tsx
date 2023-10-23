/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { StatusFilter } from './types/Filter';
import * as todosServices from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoItem } from './components/TodoItem/TodoItem';

const USER_ID = 11587;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isloadingTodo, setIsLoadingTodo] = useState<number[]>([]);
  //  Этот массив отслеживает состояние загрузки для каждой
  //  задачи (TODO) в виде идентификаторов (id). По сути,
  //  это массив идентификаторов задач, для которых
  //  требуется отображать индикатор загрузки [1,2,3,4 итд].
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
    let filteredTodos = todos;

    switch (statusFilter) {
      case StatusFilter.ACTIVE:
        filteredTodos = filteredTodos.filter((todo) => !todo.completed);
        break;

      case StatusFilter.COMPLETED:
        filteredTodos = filteredTodos.filter((todo) => todo.completed);
        break;

      default:
        break;
    }

    return filteredTodos;
  }, [todos, statusFilter]);

  function addTodo() {
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
  }

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
        <header className="todoapp__header">
          {!todos.length && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          <TodoForm
            title={title}
            setTitle={setTitle}
            addTodo={() => addTodo()}
            statusResponce={statusResponse}
          />
        </header>

        {filtredTodos.length > 0 && (
          <>
            <TodoList
              todos={filtredTodos}
              deleteTodo={deleteTodo}
              isLoadingTodo={isloadingTodo}
            />

            {tempTodo && (
              <TodoItem todo={tempTodo} deleteId={deleteTodo} isLoading />
            )}

            {todos.length > 0 && (
              <TodoFilter
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
