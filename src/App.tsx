/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessages } from './enums/ErrorMessages';
import { StatusTypes } from './enums/StatusTypes';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.NONE,
  );
  const [loadings, setLoadings] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusTypes>(
    StatusTypes.ALL,
  );

  const todosCount = todos.reduce((count, todo) => count + +!todo.completed, 0);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessages.GET_ERROR);
      })
      .finally(() => { });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timeoutId = setTimeout(() => {
        setErrorMessage(ErrorMessages.NONE);
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [errorMessage]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const deleteTodo = (todoId: number) => {
    setLoadings(currentLoadings => [...currentLoadings, todoId]);

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setLoadings(currentLoadings =>
          currentLoadings.filter(id => id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.DELETE_ERROR);
      })
      .finally(() => { });
  };

  const handleClearCompleted = () => {
    todos.filter(todo => todo.completed).map(todo => deleteTodo(todo.id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          tempTodo={tempTodo}
          setTempTodo={setTempTodo}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              loadings={loadings}
              deleteTodo={deleteTodo}
              tempTodo={tempTodo}
              todos={todos}
              statusFilter={statusFilter}
            />

            <Footer
              onClearCompleted={handleClearCompleted}
              todos={todos}
              todosCount={todosCount}
              statusFilter={statusFilter}
              onStatusFilter={setStatusFilter}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onErrorMessage={setErrorMessage}
      />
    </div>
  );
};
