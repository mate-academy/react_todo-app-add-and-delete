import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { ErrNotification } from './Component/ErrNotification/ErrNotification';
import { Footer } from './Component/Footer/Footer';
import { Header } from './Component/Header/Header';
import { TodoList } from './Component/TodoList/TodoList';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorType';
import { FilterBy } from './types/FilterBy';

const USER_ID = 11091;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [activeTodosCount, setActiveTodosCount] = useState<number>(0);
  const [complitedTodosCount, setComplitedTodosCount] = useState<number>(0);

  const [filterValue, setFilterValue] = useState<FilterBy>(FilterBy.ALL);

  const [errorMessage, setErrorMessage] = useState<ErrorType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<number[]>([]);

  const showNotification = (value: ErrorType) => {
    setErrorMessage(value);
    setTimeout(() => {
      setIsHidden(true);
    }, 3000);
  };

  const loadTodos = async () => {
    setErrorMessage(null);
    setIsHidden(false);
    setIsLoading(true);
    try {
      const loadedTodos = await todoService.getTodos(USER_ID);

      setTodos(loadedTodos);
    } catch {
      showNotification(ErrorType.LOAD);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const addTodo = async (title: string) => {
    const newTodo = {
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });
    try {
      const addedTodo = await todoService.createTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, addedTodo]);
    } catch {
      showNotification(ErrorType.ADD);
    } finally {
      setTempTodo(null);
    }
  };

  const deleteTodo = async (todoId: number) => {
    setIsDeleting(currentTodoId => [...currentTodoId, todoId]);
    try {
      await todoService.deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(({ id }) => id !== todoId));
    } catch {
      showNotification(ErrorType.DELETE);
    } finally {
      setIsDeleting([]);
    }
  };

  const deleteAllCompletedTodos = () => {
    todos.filter(({ completed }) => completed)
      .forEach(({ id }) => deleteTodo(id));
  };

  useEffect(() => {
    const activeTodos = todos.filter(({ completed }) => !completed);
    const complitedTodos = todos.filter(({ completed }) => completed);

    setActiveTodosCount(activeTodos.length);
    setComplitedTodosCount(complitedTodos.length);

    switch (filterValue) {
      case FilterBy.ACTIVE:
        setVisibleTodos(activeTodos);
        break;
      case FilterBy.COMPLETED:
        setVisibleTodos(complitedTodos);
        break;
      default:
        setVisibleTodos(todos);
        break;
    }
  }, [todos, filterValue]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          activeTodosCount={activeTodosCount}
          onSubmit={addTodo}
          onEmptyValue={showNotification}
        />
        {visibleTodos.length > 0 && (
          <TodoList
            visibleTodos={visibleTodos}
            isLoading={isLoading}
            tempTodo={tempTodo}
            onDelete={deleteTodo}
            isDeleting={isDeleting}
          />
        )}
        {todos.length > 0 && (
          <Footer
            filterValue={filterValue}
            activeTodosCount={activeTodosCount}
            complitedTodosCount={complitedTodosCount}
            setFilterValue={setFilterValue}
            onClear={deleteAllCompletedTodos}
          />
        )}
      </div>
      {errorMessage && (
        <ErrNotification
          errorMessage={errorMessage}
          isHidden={isHidden}
          onCloseError={setErrorMessage}
        />
      )}
    </div>
  );
};
