import React, { useState, useEffect, useMemo } from 'react';
import { createTodo, getTodos, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { getVisibleTodos } from './utils/helper';
import { FilterType } from './types/FilterType';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notifications } from './components/Notifications';
import { Header } from './components/Header';
import { clearNotification } from './utils/clearNotification';
import { ErrorMessage } from './types/ErrorMessage';

const USER_ID = 6356;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isTodosLoaded, setIsTodosLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [
    errorMessage,
    setErrorMessage] = useState<ErrorMessage>(ErrorMessage.None);
  const [
    selectedFilter,
    setSelectedFilter] = useState<FilterType>(FilterType.All);
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isEditingTodoId, setIsEditingTodoId] = useState(0);

  const handleError = (error: ErrorMessage, bool: boolean) => {
    setIsError(bool);
    setErrorMessage(error);
  };

  const getTodosFromServer = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
      setIsTodosLoaded(true);
    } catch (error) {
      handleError(ErrorMessage.Upload, true);
      clearNotification(handleError, 3000);
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const visibleTodos = useMemo(() => (
    getVisibleTodos(selectedFilter, todos)
  ), [todos, selectedFilter]);

  const handleFilterChange = (filter: FilterType) => {
    setSelectedFilter(filter);
  };

  const isActive = visibleTodos.some(todo => !todo.completed);
  const isCompleted = visibleTodos.some(todo => todo.completed);

  const addTodo = async (title: string) => {
    if (!title) {
      handleError(ErrorMessage.Title, true);
      clearNotification(handleError, 3000);

      return;
    }

    const newTodo = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };

    try {
      setIsInputDisabled(true);
      const todoToAdd = await createTodo(USER_ID, newTodo);

      setTempTodo(todoToAdd);

      try {
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch (error) {
        handleError(ErrorMessage.Upload, true);
        clearNotification(handleError, 3000);
      }
    } catch (error) {
      handleError(ErrorMessage.Add, true);
      clearNotification(handleError, 3000);
    } finally {
      setTempTodo(null);
      setIsInputDisabled(false);
    }
  };

  const removeTodo = async (todoToDelete: Todo) => {
    try {
      await deleteTodo(USER_ID, todoToDelete.id);
      setIsEditingTodoId(todoToDelete.id);
      try {
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch (error) {
        handleError(ErrorMessage.Upload, true);
        clearNotification(handleError, 3000);
      }
    } catch (error) {
      handleError(ErrorMessage.Delete, true);
      clearNotification(handleError, 3000);
    } finally {
      setIsEditingTodoId(0);
    }
  };

  const deleteCompletedTodos = () => {
    visibleTodos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo);
      }
    });
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setTodoTitle(value);
  };

  const clearForm = () => {
    setTodoTitle('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    addTodo(todoTitle);
    clearForm();
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todoTitle={todoTitle}
          handleSubmit={handleSubmit}
          handleInput={handleInput}
          isActive={isActive}
          isInputDisabled={isInputDisabled}
        />

        <TodoList
          todos={visibleTodos}
          onDelete={removeTodo}
          tempTodo={tempTodo}
          isEditingTodoId={isEditingTodoId}
        />

        {isTodosLoaded && (
          <Footer
            selectedFilter={selectedFilter}
            handleFilterChange={handleFilterChange}
            isCompleted={isCompleted}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}

      </div>

      <Notifications
        handleError={handleError}
        errorMessage={errorMessage}
        isError={isError}
      />

    </div>
  );
};
