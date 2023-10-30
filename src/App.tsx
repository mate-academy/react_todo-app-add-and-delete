/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Header } from './Components/Header';
import { Todo } from './types/Todo';
import { Filter } from './types/FilterBy';
import { TodosList } from './Components/TodosList';
import { Footer } from './Components/Footer';
import * as todosServise from './api/todos';
import { Error } from './types/ErrorTypes';

const USER_ID = 11723;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [temoTodo, setTempTodo] = useState<Todo | null>(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState<number[]>([]);
  //  Этот массив отслеживает состояние загрузки для каждой
  //  задачи (TODO) в виде идентификаторов (id). По сути,
  //  это массив идентификаторов задач [1,2,3,4 итд].

  function changeErrorMessage(message: string) {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  useEffect(() => {
    todosServise.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        changeErrorMessage(Error.Update);
      });
  }, []);

  const filtered: Todo[] = useMemo(() => {
    let filteredTodos = todos;

    switch (filterBy) {
      case Filter.Active:
        filteredTodos = filteredTodos.filter(todo => !todo.completed);

        break;

      case Filter.Completed:
        filteredTodos = filteredTodos.filter(todo => todo.completed);

        break;

      default:
        break;
    }

    return filteredTodos;
  }, [todos, filterBy]);

  const addTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      changeErrorMessage(Error.Title);

      return;
    }

    const newTodo = {
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    setIsError(true);

    todosServise
      .createTodo(newTodo)
      .then((finalTodo: Todo) => {
        setTodos(currentTodo => [...currentTodo, finalTodo]);
        setTitle('');
      })
      .catch(() => changeErrorMessage(Error.Add))
      .finally(() => {
        setIsError(false);
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setLoading((currentLoading) => [...currentLoading, todoId]);

    todosServise
      .deleteTodo(todoId)
      .then(() => {
        setTodos((currentTodos) => currentTodos
          .filter((todo) => todo.id !== todoId));
      })
      .catch(() => {
        changeErrorMessage(Error.Delete);
      })
      .finally(() => {
        setLoading((currentLoading) => currentLoading
          .filter((id) => id !== todoId));
      });
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
          onSubmitForm={addTodo}
          title={title}
          setTitle={setTitle}
          isDisabled={isError}
        />

        {filtered.length > 0 && (
          <TodosList
            todos={filtered}
            deleteTodo={deleteTodo}
            loading={loading}
            tempTodo={temoTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={filtered}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
          />
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
