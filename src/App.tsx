/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoApi from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { Status } from './types/Status';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState(Status.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processedId, setProcessedId] = useState<number[]>([]);

  useEffect(() => {
    todoApi
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  // useEffect(() => {
  //   console.log('useEffect > isProcessedId', isProcessedId);
  // }, [isProcessedId]);

  const filteredTodos = useMemo(() => {
    if (status === Status.all) {
      return todos;
    }

    return todos.filter(todo => {
      return status === Status.completed ? todo.completed : !todo.completed;
    });
  }, [todos, status]);

  const handleCompletedStatus = (id: number) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    );

    setTodos(updatedTodos);
  };

  function addTodo({ title, userId, completed }: Todo) {
    setErrorMessage('');
    setTempTodo({ title, userId, completed, id: 0 });

    return todoApi
      .createTodos({ title, userId, completed })
      .then(todoToAdd => {
        setTodos(currentTodos => [...currentTodos, todoToAdd]);
        setTempTodo(null);
      })
      .catch(error => {
        setTempTodo(null);
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(''), 3000);
        throw error;
      });
  }

  function deleteTodo(id: number) {
    setProcessedId(ids => [...ids, id]);

    return todoApi
      .deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => setProcessedId([]));
  }

  if (!todoApi.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setErrorMessage={setErrorMessage}
          onSubmit={addTodo}
          userId={todoApi.USER_ID}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          handleCompletedStatus={handleCompletedStatus}
          onDelete={deleteTodo}
          processedId={processedId}
        />

        {!!todos.length && (
          <TodoFilter
            setStatus={setStatus}
            status={status}
            todos={todos}
            onDelete={deleteTodo}
          />
        )}
      </div>

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

        {/*
        Unable to update a todo */}
      </div>
    </div>
  );
};
