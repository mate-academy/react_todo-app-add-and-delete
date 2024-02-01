/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { getFilteredTodos } from './services/getFilteredTodos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { USER_ID } from './constants/user';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Status>(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingPostsIds, setDeletingPostsIds] = useState<number[]>([]);

  const filteredTodos = getFilteredTodos(filter, todos);
  const activeTodosCount = todos.reduce((acc, cur) => {
    if (!cur.completed) {
      return acc + 1;
    }

    return acc;
  }, 0);

  const handleCloseError = () => {
    setErrorMessage('');
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorMessage('');
      clearInterval(timeout);
    }, 3000);

    return () => {
      clearInterval(timeout);
    };
  }, [errorMessage]);

  const handleFilter = (status: Status) => {
    setFilter(status);
  };

  const addNewTodo = (newTodo: Todo) => {
    setTodos(prev => [...prev, newTodo]);
  };

  const deleteTodo = (id: number) => {
    setTodos(prev => (
      prev.filter(todo => todo.id !== id)
    ));
  };

  const handleError = (error: string) => {
    setErrorMessage(error);
  };

  const handleSetTempTodo = (todo: Todo | null) => {
    setTempTodo(todo);
  };

  const handleDeletingPostsIds = (id: number | null) => {
    if (id) {
      setDeletingPostsIds(prev => [...prev, id]);
    } else {
      setDeletingPostsIds([]);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAddTodo={addNewTodo}
          onError={handleError}
          onSetTempTodo={handleSetTempTodo}
        />

        {(!!todos.length || !!tempTodo) && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onDeleteTodo={deleteTodo}
            onError={handleError}
            deletingPostsIds={deletingPostsIds}
            onAddDeletingPostId={handleDeletingPostsIds}
          />
        )}

        {!!todos.length && (
          <Footer
            activeTodosCount={activeTodosCount}
            filter={filter}
            onFilter={handleFilter}
            todos={todos}
            onDeleteTodo={deleteTodo}
            onError={handleError}
            onAddDeletingPostId={handleDeletingPostsIds}
          />
        )}

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
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
          onClick={handleCloseError}
        />
        {/* show only one message at a time */}
        {errorMessage}
        {/* <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
