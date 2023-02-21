/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { addTodo, getTodos, removeTodo } from './api/todos';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Notification } from './components/Notification';
import { TodoList } from './components/TodoList';
import { ErrorType } from './types/ErrorType';
import { FilterType } from './types/FilterType';
import { Todo } from './types/Todo';

const USER_ID = 6396;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [isTitleDisabled, setIsTitleDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [hasError, setHasError] = useState(false);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.None);

  const fetchAllTodos = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setHasError(true);
      setErrorType(ErrorType.Update);
      throw new Error('Error downloading todos');
    }
  };

  useEffect(() => {
    fetchAllTodos();
  }, []);

  const visibleTodos = useMemo(() => {
    let preparedTodos = [...todos];

    if (filterType) {
      switch (filterType) {
        case FilterType.All:
          preparedTodos = [...todos];
          break;
        case FilterType.Active:
          preparedTodos = todos.filter(todo => !todo.completed);
          break;
        case FilterType.Completed:
          preparedTodos = todos.filter(todo => todo.completed);
          break;
        default:
          throw new Error('Unexpected filter error');
      }
    }

    return preparedTodos;
  }, [todos, filterType]);

  const handleError = (error: boolean) => {
    setHasError(error);
  };

  const handleInput = (input: string) => {
    setTitle(input);
  };

  const handleFilterType = (filter: FilterType) => {
    setFilterType(filter);
  };

  const handleAddTodo = async (todoTitle: string) => {
    if (todoTitle.length === 0) {
      setHasError(true);
      setErrorType(ErrorType.Title);

      return;
    }

    const todoToAdd = {
      id: 0,
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    };

    try {
      setIsTitleDisabled(true);

      const newTodo = await addTodo(USER_ID, todoToAdd);

      setTempTodo(newTodo);

      setTodos(currTodos => ([
        ...currTodos, newTodo,
      ]));
    } catch (error) {
      setHasError(true);
      setErrorType(ErrorType.Add);
    } finally {
      setTitle('');
      setTempTodo(null);
      setIsTitleDisabled(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      await removeTodo(USER_ID, todoId);

      setTodos(currTodos => currTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setHasError(true);
      setErrorType(ErrorType.Delete);
    }
  };

  const handleCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          title={title}
          todos={todos}
          handleInput={handleInput}
          handleAddTodo={handleAddTodo}
          isTitleDisabled={isTitleDisabled}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              handleDeleteTodo={handleDeleteTodo}
              tempTodo={tempTodo}
            />
            <Footer
              todos={visibleTodos}
              filterType={filterType}
              handleFilterType={handleFilterType}
              handleCompletedTodos={handleCompletedTodos}
            />
          </>
        )}

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {hasError && (
        <Notification
          errorType={errorType}
          hasError={hasError}
          handleError={handleError}
        />
      )}
    </div>
  );
};
