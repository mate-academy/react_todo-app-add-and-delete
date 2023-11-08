/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import cn from 'classnames';

import * as todosServices from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Filters } from './types/Filters';

const USER_ID = 11839;

export const App: React.FC = () => {
  const [serverTodos, setServerTodos] = useState<Todo[]>([]);
  const [isloading, setIsLoading] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterBy, setFilterBy] = useState(Filters.All);
  const [title, setTitle] = useState('');
  const [response, setResponse] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const changeErrorMessage = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    todosServices
      .getTodos(USER_ID)
      .then(setServerTodos)
      .catch(() => {
        changeErrorMessage('Unable to load todos');
      });
  }, []);

  const filtredTodos: Todo[] = useMemo(() => {
    let filteredItems = serverTodos;

    switch (filterBy) {
      case Filters.Active:
        filteredItems = filteredItems.filter(todo => !todo.completed);
        break;

      case Filters.Completed:
        filteredItems = filteredItems.filter(todo => todo.completed);

        break;

      default:
        break;
    }

    return filteredItems;
  }, [serverTodos, filterBy]);

  const addTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      changeErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: normalizedTitle,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    setResponse(true);

    todosServices
      .createTodo(newTodo)
      .then((createdTodo) => {
        setTitle('');
        setServerTodos((currentTodos) => [...currentTodos, createdTodo]);
      })
      .catch(() => {
        changeErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setResponse(false);
      });
  };

  const deleteTodo = (todoId: number) => {
    setIsLoading((currentTodo) => [...currentTodo, todoId]);

    todosServices
      .deleteTodo(todoId)
      .then(() => setServerTodos(
        (currentTodo) => currentTodo.filter((todo) => todo.id !== todoId),
      ))
      .catch(() => changeErrorMessage('Unable to delete a todo'))
      .finally(() => setIsLoading(
        (currentTodo) => currentTodo.filter(
          (id: number) => id !== todoId,
        ),
      ));
  };

  const updateTodo = (todo: Todo) => {
    setIsLoading((currentTodo) => [...currentTodo, todo.id]);

    todosServices
      .updateTodo({
        ...todo,
        completed: todo.completed,
      })
      .then((updatedTodo) => setServerTodos(
        (currentTodo) => currentTodo.map((item) => (
          item.id === todo.id ? updatedTodo : item
        )),
      ))
      .catch(() => changeErrorMessage('Unable to update a todo'))
      .finally(() => setIsLoading(
        (currentTodo) => currentTodo.filter(
          (id: number) => id !== todo.id,
        ),
      ));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={serverTodos}
          response={response}
          title={title}
          setTitle={setTitle}
          onHandleSubmit={addTodo}
        />

        {filtredTodos.length && (
          <TodoList
            todos={filtredTodos}
            deleteTodo={deleteTodo}
            updateTodo={updateTodo}
            isLoading={isloading}
            tempTodo={tempTodo}
          />
        )}

        {serverTodos.length && (
          <Footer
            todos={serverTodos}
            setTodos={setServerTodos}
            filter={filterBy}
            setFilterBy={setFilterBy}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
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
