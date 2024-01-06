/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Errors } from './types/Errors';
import * as todosApiServices from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { TodosCounter } from './components/TodosCounter';
import { ClearCompleted } from './components/ClearCompleted';

export const USER_ID = 12146;

export const App: React.FC = () => {
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [loadingTodosPause, setLoadingTodosPause] = useState<number[]>([]);

  const hasCompletedTodos
    = todos?.some(({ completed }) => completed === true);

  useEffect(() => {
    setErrorMessage(null);
  }, [filter]);

  function loadPosts() {
    setLoading(true);

    todosApiServices.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.UnableToLoadTodos))
      .finally(() => setLoading(false));
  }

  useEffect(loadPosts, []);

  function addTodo(title: string) {
    setTempTodo({
      title,
      id: 0,
      userId: USER_ID,
      completed: false,
    });

    setLoading(true);
    setErrorMessage(null);

    return todosApiServices.addTodo({
      title,
      userId: USER_ID,
      completed: false,
    })
      .then((newTodo: Todo) => {
        setTodos(currentTodos => {
          return [...currentTodos, newTodo];
        });
      })
      .catch((error) => {
        setErrorMessage(Errors.UnableToAddATodo);
        throw error;
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  }

  function deleteTodo(todoId: number) {
    setLoadingTodosPause(prev => [...prev, todoId]);

    return todosApiServices.deleteUserTodo(todoId)
      .then(() => setTodos(currentTodos => currentTodos
        .filter(todo => todo.id !== todoId)))
      .catch((error) => {
        setTodos(todos);
        setErrorMessage(Errors.UnabletoDeleteATodo);
        throw error;
      })
      .finally(() => {
        setLoadingTodosPause(
          prev => prev.filter(loadingId => loadingId !== todoId),
        );
      });
  }

  function clearCompletedTodos() {
    const completedTodos
      = todos?.filter(({ completed }) => completed);

    if (completedTodos?.length) {
      Promise.all(
        completedTodos.map((todo) => deleteTodo(todo.id)),
      )
        .catch(() => {
          setErrorMessage(Errors.UnabletoDeleteATodo);
        });
    }
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <TodoInput
            onSubmit={(title) => addTodo(title)}
            setHasTitleError={setErrorMessage}
          />
        </header>

        {!loading
          && !errorMessage
          && todos
          && (
            <TodoList
              todos={todos}
              filter={filter}
              onDelete={(todoId) => deleteTodo(todoId)}
              tempTodo={tempTodo}
              loadingTodosPause={loadingTodosPause}
            />
          )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0
          && (
            <footer className="todoapp__footer" data-cy="Footer">
              <TodosCounter todos={todos} />

              {/* Active filter should have a 'selected' class */}
              <TodoFilter
                filter={filter}
                setFilter={setFilter}
              />

              {/* don't show this button if there are no completed todos */}
              <ClearCompleted
                hasCompletedTodos={hasCompletedTodos}
                clearCompletedTodos={() => clearCompletedTodos()}
              />
            </footer>
          )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};
