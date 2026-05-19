/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, postTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FilterOptions } from './types/FilterOptions';
import { ErrorMessages } from './types/ErrorMessage';
import { Header } from './components/Header/Header';
import { Main } from './components/Main/Main';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodoId, setTempTodoId] = useState(0);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [updatingTodosId, setUpdatingTodosId] = useState<number[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterOptions>(
    FilterOptions.All,
  );
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.NoError,
  );
  const newTodoInput = useRef<HTMLInputElement>(null);

  const incompleteTodosCount = useMemo(
    () =>
      todos.filter(todo => !todo.completed && todo.id !== tempTodoId).length,
    [todos, tempTodoId],
  );

  const completedTodos = todos.filter(todo => todo.completed);

  const filteredTodos = useMemo(
    () =>
      todos.filter(todo => {
        switch (selectedFilter) {
          case 'Active':
            return !todo.completed;

          case 'Completed':
            return todo.completed;

          default:
            return true;
        }
      }),
    [selectedFilter, todos],
  );

  const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const title = newTodoTitle.trim();

    if (!title) {
      setErrorMessage(ErrorMessages.EmptyTitle);

      return;
    }

    const tempTodo: Todo = {
      id: Date.now(),
      userId: USER_ID,
      title,
      completed: false,
    };

    setIsSending(true);
    setTempTodoId(tempTodo.id);
    setUpdatingTodosId(prev => [...prev, tempTodo.id]);
    setTodos(prev => [...prev, tempTodo]);

    try {
      const createdTodo = await postTodo({
        userId: USER_ID,
        title,
        completed: false,
      });

      setTodos(prev =>
        prev.map(todo => (todo.id === tempTodo.id ? createdTodo : todo)),
      );

      setNewTodoTitle('');
    } catch {
      setTodos(prev => prev.filter(todo => todo.id !== tempTodo.id));
      setErrorMessage(ErrorMessages.AddTodo);
    } finally {
      setIsSending(false);
      setTempTodoId(0);
      setUpdatingTodosId([]);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setUpdatingTodosId(prev => [...prev, id]);
    try {
      await deleteTodo(id);
      newTodoInput.current?.focus();
      setTodos(prev => prev.filter(delTodo => delTodo.id !== id));
    } catch (error) {
      setErrorMessage(ErrorMessages.DeleteTodo);
    } finally {
      setUpdatingTodosId(prev => prev.filter(todoId => todoId !== id));
    }
  };

  // const handleDeleteCompletedTodos = () => {
  //   completedTodos.forEach(compTodo => handleDeleteTodo(compTodo.id));
  // };

  const handleDeleteCompletedTodos = async () => {
    await Promise.all(completedTodos.map(todo => handleDeleteTodo(todo.id)));
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await getTodos();

        setTodos(data);
      } catch (error) {
        setErrorMessage(ErrorMessages.LoadTodos);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const hideErrorTimeout = window.setTimeout(() => {
      setErrorMessage(ErrorMessages.NoError);
    }, 3000);

    return () => {
      clearTimeout(hideErrorTimeout);
    };
  }, [errorMessage]);

  useEffect(() => {
    newTodoInput.current?.focus();
  }, [isSending]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosLength={todos.length}
          incompleteTodosCount={incompleteTodosCount}
          onAddTodo={handleAddTodo}
          isSending={isSending}
          newTodoInput={newTodoInput}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
        ></Header>

        <Main
          onDeleteTodo={handleDeleteTodo}
          todosLength={todos.length}
          filteredTodos={filteredTodos}
          updatingTodosId={updatingTodosId}
        />

        {!!todos.length && (
          <Footer
            completedTodos={completedTodos}
            incompleteTodosCount={incompleteTodosCount}
            onSelectFilter={setSelectedFilter}
            selectedFilter={selectedFilter}
            onDeleteCompletedTodos={handleDeleteCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onCloseError={setErrorMessage}
      />
    </div>
  );
};
