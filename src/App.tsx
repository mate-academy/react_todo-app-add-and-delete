/* eslint-disable no-console */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createTodo,
  deleteTodo,
  getTodos,
  TodoData,
} from './api/todos';
import { AuthContext, AuthProvider } from './components/Auth/AuthContext';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotiication';
import { NewTodoForm } from './components/NewTodoForm/NewTodoForm';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorTypes } from './types/ErrorTypes';
import { FilterOptions } from './types/FilterOptions';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorTypes>(ErrorTypes.GET);
  const [isErrorHidden, setIsErrorHidden] = useState(true);
  const [filtredBy, setFiltredBy] = useState(FilterOptions.ALL);
  const [isAdding, setIsAdding] = useState(false);
  const [deletedTodoIds, setDeletedTodoIds] = useState<number[]>([]);

  const getUserTodos = async () => {
    if (user) {
      try {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      } catch {
        setError(ErrorTypes.GET);
        setIsErrorHidden(false);
      }
    }
  };

  const addNewTodo = async (todo: TodoData) => {
    try {
      setIsErrorHidden(true);
      setIsAdding(true);
      const tempTodo = { ...todo, id: 0 };

      setTodos(prevTodos => [...prevTodos, tempTodo]);

      await createTodo(todo);
    } catch {
      setError(ErrorTypes.ADD);
      setIsErrorHidden(false);
    } finally {
      setIsAdding(false);
      getUserTodos();
    }
  };

  const deleteCurrentTodo = async (todoId: number) => {
    try {
      setIsErrorHidden(true);
      setDeletedTodoIds((currentIDs) => [...currentIDs, todoId]);

      await deleteTodo(todoId);
      setTodos(currentTodos => {
        return currentTodos.filter(todo => todoId !== todo.id);
      });

      return 1;
    } catch {
      setError(ErrorTypes.DELETE);
      setIsErrorHidden(false);

      return 0;
    } finally {
      setDeletedTodoIds([]);
    }
  };

  useEffect(() => {
    getUserTodos();
  }, []);

  const filterBySelect = useCallback((
    todosFromServer: Todo[],
    option: string,
  ) => {
    return todosFromServer.filter(todo => {
      switch (option) {
        case FilterOptions.ACTIVE:
          return todo.completed === false;

        case FilterOptions.COMPLETED:
          return todo.completed === true;

        case FilterOptions.ALL:
        default:
          return true;
      }
    });
  }, []);

  const visibleTodos = useMemo(() => {
    return filterBySelect(todos, filtredBy);
  }, [todos, filtredBy]);

  const amountOfActiveTodos = useMemo(() => {
    return filterBySelect(todos, FilterOptions.ACTIVE).length;
  }, [todos]);

  const isClearNeeded = useMemo(() => {
    return amountOfActiveTodos !== visibleTodos.length;
  }, [amountOfActiveTodos, visibleTodos]);

  const compTodos = todos
    .filter(todo => todo.completed);

  const clearCompletedTodos = async () => {
    await Promise.all(compTodos
      .map((todo) => deleteCurrentTodo(todo.id)));
  };

  return (
    <AuthProvider>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <header className="todoapp__header">
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                { active: amountOfActiveTodos === 0 },
              )}
            />

            <NewTodoForm
              onAdd={addNewTodo}
              isAdding={isAdding}
              onError={setError}
              onHiddenChange={setIsErrorHidden}
            />
          </header>
          {todos.length > 0 && (
            <>
              <TodoList
                todos={visibleTodos}
                deletedTodoIds={deletedTodoIds}
                onDelete={deleteCurrentTodo}
              />

              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="todosCounter">
                  {`${amountOfActiveTodos} items left`}
                </span>

                <TodoFilter
                  filtredBy={filtredBy}
                  onOptionChange={setFiltredBy}
                />
                <button
                  data-cy="ClearCompletedButton"
                  type="button"
                  className={classNames(
                    'todoapp__clear-completed',
                    { hidden: !isClearNeeded },
                  )}
                  onClick={clearCompletedTodos}
                >
                  Clear completed
                </button>
              </footer>
            </>
          )}
        </div>

        <ErrorNotification
          error={error}
          isHidden={isErrorHidden}
          onHiddenChange={setIsErrorHidden}
        />
      </div>
    </AuthProvider>
  );
};
