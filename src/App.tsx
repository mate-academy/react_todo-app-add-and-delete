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

  const filteredTodos = todos.filter(todo => {
    if (selectedFilter === filterValues.completed) {
      return todo.completed;
    }

    if (selectedFilter === filterValues.active) {
      return !todo.completed;
    }

    return true;
  });

  const handleAddTodo = async () => {
    try {
      setIsTodoAdding(true);

      const newTodo = {
        userId: USER_ID,
        title,
        completed: false,
      };

      await addTodo(newTodo);

      const demoTodo = {
        ...newTodo,
        id: 0,
      };

      setTempTodo(demoTodo);

      await getTodosFromServer();

      setHasError(false);
    } catch (error) {
      setHasError(true);
      setErrorType('add');
    } finally {
      setIsTodoAdding(false);
      setTempTodo(null);
    }
  };

  // eslint-disable-next-line
  const handleDeleteTodo = useCallback(async (todoId: number) => {
    try {
      setIsTodoRemoving(true);
      await removeTodo(todoId);
      await getTodosFromServer();
    } catch (error) {
      setHasError(true);
      setErrorType('delete');
    } finally {
      setIsTodoRemoving(false);
    }
  }, []);

  const handleDeleteButtonClick = (todoId: number) => {
    setRemovingTodoIds(prevTodoIds => [...prevTodoIds, todoId]);
    handleDeleteTodo(todoId);
  };

  const clearCompletedTodos = async () => {
    todos.map(todo => {
      if (todo.completed) {
        handleDeleteButtonClick(todo.id);
      }

      return true;
    });

    await getTodosFromServer();
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

        { !!todos.length && (
          <>
            <Todolist
              tempTodo={tempTodo}
              todos={filteredTodos}
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
