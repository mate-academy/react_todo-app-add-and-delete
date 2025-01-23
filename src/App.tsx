/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoServices from './api/todos';

import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { ErrorType } from './types/ErrorType';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(
    ErrorType.ERROR_DEFAULT,
  );
  const [filterTodoBy, setFilterTodoBy] = useState<FilterType>(FilterType.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deletedTodoId, setDeletedTodoId] = useState<number[] | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const asyncFetch = async () => {
      inputRef.current?.focus();

      try {
        const loadTodos = await todoServices.getTodos();

        setTodos(loadTodos);
      } catch (error) {
        setErrorMessage(ErrorType.ERROR_LOADING);
        throw error;
      }
    };

    asyncFetch();
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (FilterType.ACTIVE === filterTodoBy) {
        return !todo.completed;
      }

      if (FilterType.COMPLETED === filterTodoBy) {
        return todo.completed;
      }

      return true;
    });
  }, [todos, filterTodoBy]);

  const addTodo = ({ id, userId, title, completed }: Todo) => {
    setErrorMessage(ErrorType.ERROR_DEFAULT);
    setIsLoading(true);

    const newTempTodo = { id, userId, title, completed };

    setTempTodo(newTempTodo);

    return todoServices
      .createTodo({ title, userId, completed })
      .then(newTodo => setTodos(currentTodo => [...currentTodo, newTodo]))
      .catch(error => {
        setErrorMessage(ErrorType.ERROR_ADD);

        throw error;
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setErrorMessage(ErrorType.ERROR_DEFAULT);
    setIsLoading(true);

    return todoServices
      .deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
      })
      .catch(error => {
        setErrorMessage(ErrorType.ERROR_DELETE);

        throw error;
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const clearCompleted = () => {
    const completedTodoId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setDeletedTodoId(completedTodoId);

    const deletionCompletedTodo = completedTodoId.map(id => deleteTodo(id));

    Promise.all(deletionCompletedTodo);
  };

  if (!todoServices.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputRef={inputRef}
          isLoading={isLoading}
          setErrorMessage={setErrorMessage}
          onSubmit={addTodo}
        />

        <TodoList
          filteredTodos={filteredTodos}
          tempTodo={tempTodo}
          isLoading={isLoading}
          onDelete={deleteTodo}
          deletedTodoId={deletedTodoId}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            sortTodoBy={filterTodoBy}
            onClick={setFilterTodoBy}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessageTodo={errorMessage}
        setError={setErrorMessage}
      />
    </div>
  );
};
