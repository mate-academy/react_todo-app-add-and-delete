/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { CreateNewTodo } from './components/CreateNewTodo';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import {
  getTodos,
  addTodos,
  removeTodo,
} from './api/todos';
import { TodoInfo } from './components/TodoInfo';
import { ErrorMessage } from './types/ErrorMessage';
import { StatusFilter } from './types/StatusFilter';

const USER_ID = 10906;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<
  StatusFilter>(StatusFilter.ALL);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.LOAD);
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  }, [errorMessage]);

  const clearForm = () => {
    setTempTodo(null);
    setIsLoading(false);
  };

  const onAddTodo = useCallback(async (newTitle: string) => {
    if (!newTitle) {
      setErrorMessage(ErrorMessage.TITLE);

      return;
    }

    try {
      setIsLoading(true);

      const newTodoData = {
        userId: USER_ID,
        title: newTitle,
        completed: false,
      };

      setTempTodo({ ...newTodoData, id: 0 });

      const addedTodo = await addTodos(USER_ID, newTodoData);

      setTodos((prevTodos => [...prevTodos, addedTodo]));
      clearForm();
    } catch {
      clearForm();
      setErrorMessage(ErrorMessage.ADD);
    }
  }, []);

  const onDeleteTodo = useCallback(async (todoId: number) => {
    try {
      setLoadingTodoIds((prevIds) => [...prevIds, todoId]);
      await removeTodo(todoId);

      setTodos((prevTodos => (
        prevTodos.filter(todo => todo.id !== todoId)
      )));

      setLoadingTodoIds((prevIds) => (
        prevIds.filter(prevId => prevId !== todoId)
      ));
    } catch {
      setErrorMessage(ErrorMessage.REMOVE);
    }
  }, []);

  const handleCloseError = () => {
    setErrorMessage(null);
  };

  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed)
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  const visibleTodos = useMemo(() => {
    const { ACTIVE, COMPLETED } = StatusFilter;

    switch (selectedFilter) {
      case ACTIVE:
        return activeTodos;

      case COMPLETED:
        return completedTodos;

      default:
        return todos;
    }
  }, [todos, selectedFilter]);

  const onDeleteCompletedTodos = async () => {
    try {
      await completedTodos.forEach(todo => {
        onDeleteTodo(todo.id);
      });
    } catch {
      setErrorMessage(ErrorMessage.REMOVE);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
          />

          <CreateNewTodo
            setErrorMessage={setErrorMessage}
            onAddTodo={onAddTodo}
            isLoading={isLoading}
          />

        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              onDeleteTodo={onDeleteTodo}
              loadingTodoIds={loadingTodoIds}
            />
            {tempTodo && (
              <TodoInfo
                todo={tempTodo}
                loadingTodoId={tempTodo.id}
              />
            )}

            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${activeTodos.length} items left`}
              </span>

              <Filter
                setSelectedFilter={setSelectedFilter}
                selectedFilter={selectedFilter}
              />

              {completedTodos && (
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  onClick={onDeleteCompletedTodos}
                >
                  Clear completed
                </button>
              )}

            </footer>
          </>
        )}
      </div>

      <div
        className={classNames(
          'notification is-danger is-light has-text-weight-normal', {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={handleCloseError}
        />

        {errorMessage}
        <br />
      </div>
    </div>
  );
};
