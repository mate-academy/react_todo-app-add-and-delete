/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID, addTodo, deleteTodo, getTodos,
} from './api/todos';
import { Todo, ErrorMessage, Filter } from './types/Todo';
import { Header } from './components/Header/Header';
import { List } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { handleError } from './components/ErrorBin/handleError';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const counter = () => {
    return todos.filter(todo => !todo.completed).length;
  };

  const visibleTodos = () => {
    const visible = [...todos].filter(todo => {
      if (filter === 'Active' && todo.completed) {
        return false;
      }

      if (filter === 'Completed' && !todo.completed) {
        return false;
      }

      return true;
    });

    return visible;
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!title.trim()) {
      handleError(setErrorMessage, ErrorMessage.noTitle);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTodo);

    setIsLoading(true);
    addTodo(newTodo).then((response) => {
      setTitle('');
      setTodos((oldTodos) => [...oldTodos, response]);
    }).catch(() => {
      handleError(setErrorMessage, ErrorMessage.noAddTodo);
    }).finally(() => {
      setIsLoading(false);
      setTempTodo(null);
    });
  };

  const handleDelete = (todoId: number) => {
    deleteTodo(todoId).then(() => {
      setTodos((oldTodos) => oldTodos.filter(todo => todo.id !== todoId));
    }).catch(() => {
      handleError(setErrorMessage, ErrorMessage.noDeleteTodo);
    });
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((todo) => {
        setTodos(todo);
        setTitle('');
      })
      .catch(() => {
        handleError(setErrorMessage, ErrorMessage.noTodos);
      }).finally(() => {
        setIsLoading(false);
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
          title={title}
          setTitle={setTitle}
          handleSubmit={handleSubmit}
          todos={todos}
          isLoading={isLoading}
        />
        {todos.length > 0
        && (
          <List
            todos={visibleTodos()}
            tempTodo={tempTodo}
            handleDelete={handleDelete}
          />
        )}
        {todos.length > 0 && (
          <Footer
            counter={counter()}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          !errorMessage && 'hidden'
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
        <br />
        {/* Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
