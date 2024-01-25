/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { Header } from './componens/Header/Header';
import { TodoList } from './componens/Todos/TodoList';
import { Footer } from './componens/Footer/Footer';

const USER_ID = 11582;

enum StatusFilter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const [status, setStatus] = useState<StatusFilter>(StatusFilter.ALL);
  const [errorMessege, setErrorMessege] = useState('');
  const [statusResponse, setStatusResponse] = useState(false);

  const [textTodo, setTextTodo] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setErrorMessege('');
    }, 3000);
  }, [errorMessege]);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessege('Unable to load todos');
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function filterTodo() {
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
  }

  const deleteTodo = (id: number) => {
    todoService.deleteTodos(id)
      .then(() => {
        setTodos(
          prevTodos => [...prevTodos].filter(todo => todo.id !== id),
        );
      })
      .catch((error) => {
        setErrorMessege('Unable to delete a todo');
        throw error;
      });
  };

  const clearCompleted = () => {
    todos.forEach((todo) => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  };

  const createTodo = (
    title: string,
  ) => {
    if (!title.trim()) {
      setErrorMessege('Title should not be empty');

      return;
    }

    setStatusResponse(true);
    setTemporaryTodo(
      {
        userId: USER_ID, title, completed: false, id: 0,
      },
    );

    todoService.createTodos({ userId: USER_ID, title, completed: false })
      .then(newTodo => {
        setTodos(prevTodo => [...prevTodo, newTodo]);
        setTextTodo('');
      })
      .catch((error) => {
        setErrorMessege('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setStatusResponse(false);
        setTemporaryTodo(null);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          setTextTodo={setTextTodo}
          textTodo={textTodo}
          createTodo={createTodo}
          statusResponse={statusResponse}
        />

        <TodoList
          todos={filterTodo()}
          deleteTodo={deleteTodo}
          temporaryTodo={temporaryTodo}
        />

        {todos.length > 0 && (
          <Footer
            status={status}
            setStatus={setStatus}
            todos={todos}
            clearCompleted={clearCompleted}
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
            { hidden: !errorMessege },
          )
        }

      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessege('')}
        />
        {errorMessege}

      </div>
    </div>
  );
};
