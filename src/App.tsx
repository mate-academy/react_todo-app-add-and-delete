/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */

// #region imports
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';

import { Todo } from './types/Todo';
import { ErrorMessages } from './types/Errors';
import { FilterStatus } from './types/FilterStatus';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
// #endregion

export const App: React.FC = () => {
  // #region todos and errors
  const [todos, setTodos] = useState<Todo[]>([]);
  const sortedTodos = useMemo(
    () => ({
      active: todos.filter(todo => !todo.completed),
      completed: todos.filter(todo => todo.completed),
    }),
    [todos],
  );

  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.None,
  );
  // #endregion

  // #region filterStatus and  filter handling
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );

  const getFilteredTodos = useCallback(
    (allTodos: Todo[], status: FilterStatus) => {
      let filteredTodos = [...allTodos];

      if (status) {
        filteredTodos =
          status === FilterStatus.Completed
            ? sortedTodos.completed
            : sortedTodos.active;
      }

      return filteredTodos;
    },
    [sortedTodos],
  );

  const filteredTodos = useMemo(
    () => getFilteredTodos(todos, filterStatus),
    [getFilteredTodos, todos, filterStatus],
  );
  // #endregion

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessages.Loading);
      });
  }, []);

  // #region add and delete handling
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleAddingTodo = useCallback(
    (newTodo: string) => {
      const trimmedTodo = newTodo.trim();

      if (!trimmedTodo) {
        setErrorMessage(ErrorMessages.Title);

        return Promise.reject();
      }

      const addedTodo: Todo = {
        id: 0,
        userId: USER_ID,
        title: trimmedTodo,
        completed: false,
      };

      setTempTodo(addedTodo);

      return addTodo(addedTodo)
        .then(todo => setTodos([...todos, todo]))
        .catch(() => {
          setErrorMessage(ErrorMessages.Adding);
          throw Error();
        })
        .finally(() => {
          setTempTodo(null);
        });
    },
    [todos],
  );

  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);

  const handleDeleting = useMemo(
    () => ({
      todo(id: number) {
        setLoadingTodosIds(currentIds => [...currentIds, id]);

        deleteTodo(id)
          .then(() =>
            setTodos(currentTodos =>
              currentTodos.filter(todo => todo.id !== id),
            ),
          )
          .catch(() => setErrorMessage(ErrorMessages.Deleting))
          .finally(() =>
            setLoadingTodosIds(currentIds =>
              currentIds.filter(todoId => todoId !== id),
            ),
          );
      },
      completedTodos(ids: number[]) {
        setLoadingTodosIds(currentIds => [...currentIds, ...ids]);

        Promise.all(ids.map(id => deleteTodo(id)))
          .then(() => setTodos(sortedTodos.active))
          .catch(() => setErrorMessage(ErrorMessages.Deleting))
          .finally(() =>
            setLoadingTodosIds(currentIds =>
              currentIds.filter(id => !ids.includes(id)),
            ),
          );
      },
    }),
    [sortedTodos],
  );
  // #endregion

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header todos={todos} onToggle={setTodos} onAdding={handleAddingTodo} />

        <TodoList
          todos={filteredTodos}
          onTodosChange={setTodos}
          loadingTodosIds={loadingTodosIds}
          onTodoDelete={handleDeleting.todo}
        />

        <TransitionGroup>
          {tempTodo && (
            <CSSTransition key={0} timeout={300} classNames="temp-item">
              <TodoItem todo={tempTodo} isTodoLoading={true} />
            </CSSTransition>
          )}
        </TransitionGroup>

        {!!todos.length && (
          <Footer
            sortedTodos={sortedTodos}
            filterStatus={filterStatus}
            onStatusChange={setFilterStatus}
            onCompletedDelete={handleDeleting.completedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onErrorClean={setErrorMessage}
      />
    </div>
  );
};
