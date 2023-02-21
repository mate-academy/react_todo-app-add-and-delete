/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { addTodos, deleteTodo, getTodos } from './api/todos';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Notification } from './components/Notifications';
import { TodoList } from './components/TodoList';
import { ErrorMessages } from './types/errorMessages';
import { Status } from './types/Status';
import { Todo } from './types/Todo';
import { getVisibleTodos } from './utils/PreparedTodo';

const USER_ID = 6386;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasServerError, setServerError] = useState(false);
  const [status, setStatus] = useState<Status>(Status.All);
  const [name, setName] = useState('');
  const [errorType, setErrorType] = useState<ErrorMessages>(ErrorMessages.NONE);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const visibletodos = getVisibleTodos(todos, status);

  const getTodosFromServer = async () => {
    try {
      setServerError(false);
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setServerError(true);
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const handleAddTodo = async (todoName: string) => {
    if (todoName.length === 0) {
      setErrorType(ErrorMessages.TITLE);
      setServerError(true);

      return;
    }

    const todoToAdd = {
      id: 0,
      userId: USER_ID,
      title: todoName,
      completed: false,
    };

    const newTodo = await addTodos(USER_ID, todoToAdd);

    setTempTodo(newTodo);

    try {
      setName('');
      setTempTodo(null);

      await getTodosFromServer();
    } catch {
      setServerError(true);
      setErrorType(ErrorMessages.ADD);
    }
  };

  const handleDeleteTodo = async (todoToDelete: Todo) => {
    try {
      await deleteTodo(USER_ID, todoToDelete.id);

      await getTodosFromServer();
    } catch {
      setServerError(true);
      setErrorType(ErrorMessages.DELETE);
    }
  };

  const handleDeleteCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo);
      }
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          name={name}
          setName={setName}
          handleAddTodo={handleAddTodo}
        />
        <TodoList
          todos={visibletodos}
          handleDeleteTodo={handleDeleteTodo}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={visibletodos}
            status={status}
            setStatus={setStatus}
            handleDeleteCompletedTodos={handleDeleteCompletedTodos}
          />
        )}

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Notification
        errorType={errorType}
        hasError={hasServerError}
        setHasError={setServerError}
      />
    </div>
  );
};
