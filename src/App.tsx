/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TypeTodos } from './types/type';
import { addTodos, deleteTodos, getTodos } from './api/todos';
import { TodoFilter } from './components/Footer/TodoFilter';
import { TodoList } from './components/TodoList/TodoList';
import { TodoApp } from './components/TodoApp/TodoApp';
import { TodoError } from './components/TodoError/TodoError';
import { ErrorType } from './types/error';

const USER_ID = 11299;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [typeTodos, setTypeTodos] = useState<TypeTodos>(TypeTodos.All);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(ErrorType.None);
  const [notification, setNotifcation] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorType.Load);
        setNotifcation(true);
        setTimeout(() => {
          setNotifcation(false);
        }, 3000);
      });
  }, []);

  const filteredTodos = useMemo(() => {
    switch (typeTodos) {
      case TypeTodos.Active:
        return todos.filter(todo => !todo.completed);
      case TypeTodos.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, typeTodos]);

  const deleted = (postId: number) => {
    deleteTodos(postId)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== postId));
      })
      .catch(() => {
        setErrorMessage(ErrorType.Delete);
        setNotifcation(true);
        setTimeout(() => {
          setNotifcation(false);
        }, 3000);
      });
  };

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    setTempTodo({ id: 0, ...newTodo });
    addTodos(newTodo)
      .then((addedTodo) => {
        setTodos(prevTodo => [...prevTodo, addedTodo]);
        setTempTodo(null);
        setTimeout(() => {
          setNotifcation(false);
        }, 3000);
      })
      .catch(() => {
        setErrorMessage(ErrorType.Add);
        setNotifcation(true);
        setTempTodo(null);
        setTimeout(() => {
          setNotifcation(false);
        }, 3000);
      });
  };

  const deleteCompletedTodos = () => {
    const allCompletedId
    = todos.filter(todo => todo.completed).map(todo => todo.id);

    Promise.all(allCompletedId.map(todoId => deleteTodos(todoId)))
      .then(() => {
        setTodos(todos.filter(todo => !todo.completed));
      })
      .catch(() => {
        setErrorMessage(ErrorType.Delete);
        setNotifcation(true);
      });
  };

  const closeNotification = () => {
    setNotifcation(false);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoApp
          todos={todos}
          addTodo={addTodo}
          setErrorMessage={setErrorMessage}
          setNotifcation={setNotifcation}
        />
        <TodoList
          filteredTodos={filteredTodos}
          deleted={deleted}
          todos={todos}
          setTodos={setTodos}
          tempTodo={tempTodo}
        />
        <TodoFilter
          todos={todos}
          setTypeTodos={setTypeTodos}
          deleteCompletedTodos={deleteCompletedTodos}
          filteredTodos={filteredTodos}
        />
      </div>
      {notification && (
        <TodoError
          errorMessage={errorMessage}
          closeNotification={closeNotification}
        />
      )}
    </div>
  );
};
