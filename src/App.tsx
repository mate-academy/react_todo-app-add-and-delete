/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';

import { USER_ID, getTodos, deleteTodo } from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Filter, Status } from './utils/TodoFilter';
import { ErrorMessages } from './types/ErrorMessages';

export const App: React.FC = () => {
  const [errorNotification, setErrorNotification] =
    useState<ErrorMessages | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Status>(Status.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState([0]);

  const preparedTodos = Filter(todos, selectedFilter);
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  const handleSetErrorNotification = (error: ErrorMessages) => {
    switch (error) {
      case ErrorMessages.EmptyTitle:
        setErrorNotification(ErrorMessages.EmptyTitle);
        break;
      case ErrorMessages.AddTodo:
        setErrorNotification(ErrorMessages.AddTodo);
        break;
      case ErrorMessages.DeleteTodo:
        setErrorNotification(ErrorMessages.DeleteTodo);
        break;
      case ErrorMessages.LoadTodos:
        setErrorNotification(ErrorMessages.LoadTodos);
        break;
      default:
        setErrorNotification(null);
    }
  };

  const handleErrorClose = () => {
    setErrorNotification(null);
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoading(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() =>
        setTodos((prev: Todo[]) => prev.filter(todo => todo.id !== todoId)),
      )
      .catch(() => {
        setErrorNotification(ErrorMessages.DeleteTodo);
      })
      .finally(() => {
        setLoading((prev: number[]) => prev.filter(id => id !== todoId));
      });
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorNotification(ErrorMessages.LoadTodos));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          setErrorNotification={handleSetErrorNotification}
        />

        <TodoList
          todos={preparedTodos}
          loading={loading}
          tempTodo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            selectedFilter={selectedFilter}
            activeTodosCount={activeTodosCount}
            handleDeleteTodo={handleDeleteTodo}
            setSelectedFilter={setSelectedFilter}
            completedTodosCount={completedTodosCount}
          />
        )}
      </div>

      <ErrorNotification
        errorNotification={errorNotification}
        setErrorNotification={handleErrorClose}
      />
    </div>
  );
};
