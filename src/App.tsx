import React, { useEffect, useState } from 'react';

import classNames from 'classnames';
import { addTodo, getTodos, removeTodo } from './api/todos';

import { Todo } from './types/Todo';
import { SortType } from './types/SortType';
import { ErrorsType } from './types/ErrorsType';

import { filterTodos } from './utils/helpers/filterBySort';

import { UserWarning } from './UserWarning';
import { HeaderTodo } from './components/HeaderTodo';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';

const USER_ID = 7036;
// const USER_ID = 6749;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [sortType, setSortType] = useState<SortType>(SortType.ALL);
  const [error, setError] = useState<ErrorsType>(ErrorsType.EMPTY);
  const [isHiddenError, setIsHiddenError] = useState(true);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);

  const handlerError = (whatError: ErrorsType) => {
    setError(whatError);
    setIsHiddenError(false);

    setTimeout(() => {
      setIsHiddenError(true);
    }, 3000);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const fetchedTodos = await getTodos(USER_ID);

        setTodos(fetchedTodos);
      } catch {
        handlerError(ErrorsType.UPDATE);
      }
    };

    fetchTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = filterTodos(todos, sortType);
  const hasCompletedTodos = todos.some(todo => todo.completed);

  const addNewTodo = async (title: string) => {
    if (!title.trim()) {
      handlerError(ErrorsType.EMPTY);

      return;
    }

    const normalizedTitle = title.trim();

    const newTodo = {
      title: normalizedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    try {
      const addingTodo = await addTodo(newTodo);

      setTodos(prevTodos => ([
        ...prevTodos,
        addingTodo,
      ]));
    } catch {
      handlerError(ErrorsType.ADD);
    } finally {
      setTempTodo(null);
    }
  };

  const handlerSortType = (type: SortType) => {
    setSortType(type);
  };

  const handleCloseError = () => {
    setIsHiddenError(true);
  };

  const handlerDeleteTodo = async (todoId: number) => {
    try {
      setLoadingTodosIds(prevLoaderIds => ([
        ...prevLoaderIds,
        todoId,
      ]));

      await removeTodo(todoId);

      setTodos((prevTodos => prevTodos.filter(todo => todoId !== todo.id)));
    } catch {
      handlerError(ErrorsType.DELETE);
    } finally {
      setLoadingTodosIds(prevLoaderIds => (
        prevLoaderIds.filter(id => id !== todoId)
      ));
    }
  };

  const handlerRemoveAllCompletedTodo = async () => {
    const completedTodosIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setLoadingTodosIds(prevLoadIds => ([
      ...prevLoadIds,
      ...completedTodosIds,
    ]));

    await Promise.all(completedTodosIds.map(id => handlerDeleteTodo(id)));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <HeaderTodo
            todos={todos}
            onAddTodo={addNewTodo}
            hasCompletedTodos={hasCompletedTodos}
          />
        </header>

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          onDelete={handlerDeleteTodo}
          idsForLoader={loadingTodosIds}
        />

        {todos[0] && (
          <TodoFooter
            todos={todos}
            sortType={sortType}
            onSelect={handlerSortType}
            onClearCompleted={handlerRemoveAllCompletedTodo}
            hasCompletedTodos={hasCompletedTodos}
          />
        )}
      </div>

      <div
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: isHiddenError,
          },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={handleCloseError}
          aria-label="delete error message"
        />

        {error}
      </div>
    </div>
  );
};
