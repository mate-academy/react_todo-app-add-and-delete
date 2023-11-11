/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import * as postService from './api/todos';

const USER_ID = 11636;

enum StatusFilter {
  ALL = 'ALL',
  COMPLETED = 'COMPLETED',
  ACTIVE = 'ACTIVE',
}

export const App: React.FC = () => {
  const [textTodo, setTextTodo] = useState('');
  const [status, setStatus] = useState<StatusFilter>(StatusFilter.ALL);
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [error, setError] = useState('');
  const [statusResponse, setStatusResponse] = useState(false);
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setError('');
    }, 3000);
  }, [error]);

  useEffect(() => {
    postService.getTodos(USER_ID)
      .then(todo => {
        setTodos(todo);
        setTextTodo('');
      })
      .catch(() => {
        setError('Unable to load todos');
      }).finally(() => {
        setStatusResponse(false);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const todoFilter = () => {
    const filterTodos: Todo[] = [...todos].filter((todo) => {
      switch (status) {
        case StatusFilter.ACTIVE:
          return !todo.completed;

        case StatusFilter.COMPLETED:
          return todo.completed;

        default:
          return todo;
      }
    });

    return filterTodos;
  };

  const deleteTodo = (todoId: number) => {
    postService.deleteTodo(todoId)
      .then(() => {
        setTodos(
          prevTodos => [...prevTodos].filter(todo => todo.id !== todoId),
        );
      })
      .catch((err) => {
        setError('Unable to delete a todo');
        throw err;
      });
  };

  const clearComponent = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  };

  const addTodo = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!textTodo.trim()) {
      setError('Title should not be empty');

      return;
    }

    const newTodos = {
      id: 0,
      userId: USER_ID,
      title: textTodo.trim(),
      completed: false,
    };

    setTemporaryTodo(newTodos);
    setStatusResponse(true);

    postService.createTodo(newTodos)
      .then(newTodo => {
        setTextTodo('');
        setTodos(currentTodo => [...currentTodo, newTodo]);
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setTemporaryTodo(null);
        setStatusResponse(false);
      });
  };

  const completedTodo = todos.filter(todo => !todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          textTodo={textTodo}
          setTextTodo={setTextTodo}
          todos={todos}
          handleSubmit={addTodo}
          statusResponse={statusResponse}
        />

        {todos.length > 0 && (
          <TodoList
            todos={todoFilter()}
            deleteTodo={deleteTodo}
            temporaryTodo={temporaryTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            status={status}
            setStatus={setStatus}
            todos={completedTodo}
            clearCompleted={clearComponent}
          />
        )}

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={
          classNames(
            'notification is-danger is-light has-text-weight-normal',
            { hidden: !error },
          )
        }
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {/* show only one message at a time */}
        {error}
      </div>
    </div>
  );
};
