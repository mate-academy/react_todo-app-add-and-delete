import React, { useEffect, useState } from 'react';

import classNames from 'classnames';
import { addTodo, getTodos, removeTodo } from './api/todos';

import { Todo } from './types/Todo';
import { SortType } from './types/SortType';
import { filterTodos } from './utils/helpers/filterByQueryAndSort';

import { UserWarning } from './UserWarning';
import { AddingTodo } from './components/HeaderTodo';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoItem } from './components/TodoItem';

const USER_ID = 7036;
// const USER_ID = 6749;

export enum ErrorsType {
  EMPTY = 'Title cannot be empty',
  ADD = 'Unable to add todo',
  DELETE = 'Unable to delete todo',
  UPDATE = 'Unable to update todo',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [sortType, setSortType] = useState<SortType>(SortType.ALL);

  const [error, setError] = useState<ErrorsType>(ErrorsType.EMPTY);

  const [isHiddenError, setIsHiddenError] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);

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

  const deleteTodo = async (todoId: number) => {
    try {
      await removeTodo(todoId);

      setTodos((prevTodos => prevTodos.filter(todo => todoId !== todo.id)));
    } catch {
      handlerError(ErrorsType.DELETE);
    }
  };

  const handlerRemoveTodo = async (
    todoId: number,
    setIsDeleting: (isDeleting: boolean) => void,
  ) => {
    setIsDeleting(true);

    await deleteTodo(todoId);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <AddingTodo
            todos={todos}
            onAddTodo={addNewTodo}
          />
        </header>

        <TodoList
          todos={visibleTodos}
          onDelete={handlerRemoveTodo}
        />

        {tempTodo && (
          <TodoItem todo={tempTodo} isActive={isLoading} />
        )}

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            sortType={sortType}
            onSelect={handlerSortType}
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
