/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';

import { addTodo, deleteTodo, getTodos } from './api/todos';
import { AddTodoForm } from './components/AddTodoForm';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './types/ErrorMessage';
import { FilterTypes } from './types/FIlterTypes';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { filterTodos } from './utils/filterTodos';

const USER_ID = 6359;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterType, setFilterType] = useState(FilterTypes.ALL);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | string>('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [toDeleteTodos, setToDeleteTodos] = useState<number[]>([]);

  const fetchUserTodos = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorMessage(ErrorMessage.FIND);
      setHasError(true);
    }
  };

  useEffect(() => {
    fetchUserTodos();
  }, []);

  const handleAddTodo = async (todoTitle: string) => {
    if (!todoTitle) {
      setErrorMessage(ErrorMessage.EMPTY_TITLE);
      setHasError(true);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: todoTitle,
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      setInputDisabled(true);

      await addTodo(USER_ID, newTodo);
      await fetchUserTodos();
    } catch (error) {
      setHasError(true);
      setErrorMessage(ErrorMessage.ADD);
    } finally {
      setTempTodo(null);
      setInputDisabled(false);
    }
  };

  const handleDelete = async (todoId: number) => {
    setToDeleteTodos((currentIds) => [...currentIds, todoId]);

    try {
      await deleteTodo(todoId);
      await fetchUserTodos();
      setToDeleteTodos([]);
    } catch (error) {
      setHasError(true);
      setErrorMessage(ErrorMessage.DELETE);
      setToDeleteTodos([]);
    }
  };

  const visibleTodos = useMemo(() => {
    return filterTodos(todos, filterType);
  }, [todos, filterType]);

  const handleFilterType = (filter: FilterTypes) => {
    setFilterType(filter);
  };

  const changeHasError = (value: boolean) => setHasError(value);

  const hasCompletedTodos = todos.some(todo => todo.completed);

  const deleteAllCompleted = async () => {
    const completedIds = todos.filter((todo) => todo.completed)
      .map(todo => todo.id);

    await completedIds.forEach(id => handleDelete(id));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button type="button" className="todoapp__toggle-all active" />

          <AddTodoForm
            handleAddTodo={handleAddTodo}
            inputDisabled={inputDisabled}
          />
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              handleDelete={handleDelete}
              toDeleteTodos={toDeleteTodos}
            />

            <Footer
              filterType={filterType}
              handleFilterType={handleFilterType}
              hasCompletedTodos={hasCompletedTodos}
              deleteAllCompleted={deleteAllCompleted}
            />
          </>
        )}
      </div>

      <Notification
        hasError={hasError}
        changeHasError={changeHasError}
        errorMessage={errorMessage}
      />
    </div>
  );
};
