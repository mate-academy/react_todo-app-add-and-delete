/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { addTodo, getTodos, removeTodo } from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Todolist } from './components/Todolist';
import { filterValues } from './constants';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

const USER_ID = 6438;

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [errorType, setErrorType] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isTodoAdding, setIsTodoAdding] = useState(false);
  const [isTodoRemoving, setIsTodoRemoving] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [removingTodoIds, setRemovingTodoIds] = useState<number[]>([]);

  const hasActive = todos.some(todoItem => !todoItem.completed);

  const getTodosFromServer = async () => {
    try {
      const response = await getTodos(USER_ID);

      setTodos(response);
    } catch (error) {
      setHasError(true);
      setErrorType('upload');
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    if (selectedFilter === filterValues.completed) {
      return todo.completed;
    }

    if (selectedFilter === filterValues.active) {
      return !todo.completed;
    }

    return true;
  });

  // eslint-disable-next-line
  const handleAddTodo = useCallback(async () => {
    const newTodoToFetch = {
      userId: USER_ID,
      title,
      completed: false,
    };

    const newTodoToShow = {
      ...newTodoToFetch,
      id: 0,
    };

    setIsTodoAdding(true);
    setTempTodo(newTodoToShow);

    try {
      const addedTodo = await addTodo(newTodoToFetch);

      setTodos(prevTodos => [...prevTodos, addedTodo]);

      setHasError(false);
    } catch (error) {
      setHasError(true);
      setErrorType('add');
    } finally {
      setIsTodoAdding(false);
      setTempTodo(null);
    }
  }, [title]);

  // eslint-disable-next-line
  const handleDeleteTodo = useCallback(async (todoId: number) => {
    try {
      setIsTodoRemoving(true);
      await removeTodo(todoId);

      const updatedTodos = todos.filter(todo => todo.id !== todoId);

      setTodos(updatedTodos);
    } catch (error) {
      setHasError(true);
      setErrorType('delete');
    } finally {
      setIsTodoRemoving(false);
    }
  }, [todos]);

  const handleDeleteButtonClick = (todoId: number) => {
    setRemovingTodoIds(prevTodoIds => [...prevTodoIds, todoId]);
    handleDeleteTodo(todoId);
  };

  const clearCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteButtonClick(todo.id);
      }
    });

    setIsTodoRemoving(false);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          hasActive={hasActive}
          setHasError={setHasError}
          setErrorType={setErrorType}
          isTodoAdding={isTodoAdding}
          handleAddTodo={handleAddTodo}
        />

        { (!!todos.length || tempTodo) && (
          <>
            <Todolist
              tempTodo={tempTodo}
              todos={visibleTodos}
              isTodoRemoving={isTodoRemoving}
              removingTodoIds={removingTodoIds}
              setHasCompleted={setHasCompleted}
              handleDeleteButtonClick={handleDeleteButtonClick}
            />

            <Footer
              todos={todos}
              hasCompleted={hasCompleted}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              clearCompletedTodos={clearCompletedTodos}
            />
          </>
        ) }
      </div>

      { hasError && (
        <ErrorNotification
          hasError={hasError}
          errorType={errorType}
          setHasError={setHasError}
        />
      ) }
    </div>
  );
};
