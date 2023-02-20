/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import {
  getTodos, addTodo, removeTodo, updateTodo,
} from './api/todos';
import { FilterType } from './types/FilterType';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { ErrorMessage } from './components/ErrorMessage';
import { ErrorMessages } from './types/ErrorMessages';

export const App: React.FC<Todo[]> = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [errorType, setErrorType] = useState<ErrorMessages>(ErrorMessages.None);
  const [isErrorHidden, setIsErrorHidden] = useState(true);

  const loadTodos = async () => {
    try {
      const loadedTodos = await getTodos();

      setTodos(loadedTodos);
    } catch (error) {
      setErrorType(ErrorMessages.Load);
      setIsErrorHidden(false);
    }
  };

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todos, filterType);
  }, [filterType, todos]);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    const timerId = setTimeout(setIsErrorHidden, 3000, true);

    return () => clearTimeout(timerId);
  }, [isErrorHidden]);

  const addTodoOnServer = async (todo: Todo) => {
    try {
      await addTodo(todo);
      await loadTodos();
    } catch (error) {
      setErrorType(ErrorMessages.Add);
      setIsErrorHidden(false);
    }
  };

  const removeTodoFromServer = async (id: number) => {
    try {
      await removeTodo(id);
      await loadTodos();
    } catch (error) {
      setErrorType(ErrorMessages.Delete);
      setIsErrorHidden(false);
    }
  };

  const removeCompletedTodos = () => {
    const completedTodosId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedTodosId.forEach(id => {
      removeTodoFromServer(id);
    });
  };

  const updateTodoOnServer = async (todo: Todo) => {
    try {
      await updateTodo(todo);
      await loadTodos();
    } catch (error) {
      setErrorType(ErrorMessages.Update);
      setIsErrorHidden(false);
    }
  };

  const selectAllTodos = (isEverythingDone: boolean) => {
    todos
      .filter((todo) => todo.completed !== isEverythingDone)
      .forEach((todo) => {
        updateTodoOnServer({
          ...todo,
          completed: isEverythingDone,
        });
      });
  };

  const toggleAllTodos = async (isEverythingDone: boolean) => {
    selectAllTodos(isEverythingDone);
  };

  const handleErrors = (error: ErrorMessages) => {
    setErrorType(error);
    setIsErrorHidden(false);
  };

  const closeErrorMessage = () => {
    setIsErrorHidden(true);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodoOnServer={addTodoOnServer}
          todos={todos}
          toggleAllTodos={toggleAllTodos}
          handleErrors={handleErrors}
        />
        <TodoList
          todos={filteredTodos}
          removeTodoFromServer={removeTodoFromServer}
          updateTodoOnServer={updateTodoOnServer}
        />
        <Footer
          filterBy={setFilterType}
          filterType={filterType}
          todos={todos}
          removeCompletedTodos={removeCompletedTodos}
        />
      </div>
      {errorType && (
        <ErrorMessage
          errorType={errorType}
          isErrorHidden={isErrorHidden}
          closeErrorMessage={closeErrorMessage}
        />
      )}
    </div>
  );
};
