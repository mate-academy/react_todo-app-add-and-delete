/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoApp } from './components/TodoApp';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';
import { todosApi } from './api/todos';
import './App.scss';

const USER_ID = 10914;

export const App: React.FC = () => {
  const [usersTodos, setUsersTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deletedTodoId, setDeletedTodoId] = useState<number[]>([]);

  useEffect(() => {
    todosApi.getTodos(USER_ID)
      .then(setUsersTodos)
      .catch(() => setErrorMessage('Unable to load Todos'));
  }, []);

  useEffect(() => {
    setTimeout(() => setErrorMessage(''), 3000);
  }, [errorMessage]);

  const createTodo = useCallback(async (title: string) => {
    try {
      const newTodo = await todosApi.createTodo({
        userId: USER_ID,
        completed: false,
        title,
      });

      setUsersTodos(prevTodos => [...prevTodos, newTodo]);

      return newTodo;
    } catch (error) {
      setErrorMessage('Unable to add a todo');

      return null;
    }
  }, []);

  const handleAddingNewTodo = async (newTodoInput: string) => {
    if (!newTodoInput.trim()) {
      setErrorMessage('Title can\'t be empty');
    } else {
      setIsLoading(true);
      setTempTodo({
        id: 0,
        title: newTodoInput,
        userId: USER_ID,
        completed: false,
      });

      await createTodo(newTodoInput);

      setTempTodo(null);
      setIsLoading(false);
    }
  };

  const deleteTodo = useCallback(async (id: number) => {
    try {
      const response = await todosApi.deleteTodo(id);
      const isDeleted = Boolean(response);

      if (isDeleted) {
        setUsersTodos((prev) => prev.filter(todo => todo.id !== id));
      }

      return isDeleted;
    } catch (error) {
      setErrorMessage('Unable to delete a todo');

      return null;
    }
  }, []);

  const handleDeletingTodo = async (todoId: number) => {
    setIsLoading(true);
    setDeletedTodoId(prev => [...prev, todoId]);
    await deleteTodo(todoId);
    setIsLoading(false);
  };

  let visibleTodos = [...usersTodos];

  if (filter === 'all') {
    visibleTodos = [...usersTodos];
  }

  if (filter === 'active') {
    visibleTodos = visibleTodos.filter(todo => !todo.completed);
  }

  if (filter === 'completed') {
    visibleTodos = visibleTodos.filter(todo => todo.completed);
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={visibleTodos}
          handleAddingNewTodo={handleAddingNewTodo}
          isLoading={isLoading}
        />

        <TodoApp
          todos={visibleTodos}
          tempTodo={tempTodo}
          handleDeletingTodo={handleDeletingTodo}
          isLoading={isLoading}
          deletedTodoId={deletedTodoId}
        />

        {(visibleTodos.length > 0 || filter !== 'all')
        && (
          <Footer
            filter={filter}
            setFilter={setFilter}
            todosNumber={usersTodos.filter(todo => !todo.completed).length}
            visibleTodos={visibleTodos}
            handleDeletingTodo={handleDeletingTodo}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
