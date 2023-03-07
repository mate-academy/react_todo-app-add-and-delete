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
  const [isTodoAdding, setIsTodoAdding] = useState(false);
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

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    setRemovingTodoIds(prevTodoIds => [...prevTodoIds, todoId]);

    try {
      await removeTodo(todoId);

      const updatedTodos = todos.filter(todo => todo.id !== todoId);

      setTodos(updatedTodos);
    } catch (error) {
      setHasError(true);
      setErrorType('delete');
    } finally {
      setRemovingTodoIds(prevTodoIds => prevTodoIds
        .filter((id) => id === todoId));
    }
  }, [todos]);

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

  const clearCompletedTodos = async () => {
    const completedTodosIds = [...todos]
      .filter(todo => todo.completed)
      .map((todo) => todo.id);

    setRemovingTodoIds(completedTodosIds);

    Promise.all(completedTodosIds.map((id) => removeTodo(id)))
      .then(() => {
        const activeTodos = todos
          .filter(todo => !todo.completed);

        setTodos(activeTodos);
      });
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
              removingTodoIds={removingTodoIds}
              handleDeleteTodo={handleDeleteTodo}
            />

            <Footer
              todos={todos}
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
