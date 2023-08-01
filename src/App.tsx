/* eslint-disable padding-line-between-statements */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoNotification } from './components/TodoNotification/TodoNotification';
import * as postServes from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { FilterType } from './types/enum';
import { getPreperadTodos } from './utils/helper';

export const USER_ID = 11122;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | null>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filterBy, setFilterBy] = useState<string>(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const isError = !!errorMessage;

  useEffect(() => {
    setLoading(true);
    postServes.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load a todo');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const addTodo = (createdTodo: Todo) => {
    setLoading(true);
    setTempTodo(createdTodo);

    postServes.createTodo(createdTodo)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos!, newTodo]);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setRemovingId(todoId);
    postServes.deleteTodos(todoId)
      .then(() => {
        setTodos((currentTodos: Todo[] | null) => {
          if (!currentTodos) {
            return null;
          }
          return currentTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setRemovingId(null);
      });
  };

  const deleteCompletedTodo = () => {
    setLoading(true);

    const completedTodos = todos?.filter(todo => todo.completed);

    if (!completedTodos || completedTodos.length === 0) {
      setErrorMessage('No completed todos to delete');
      setLoading(false);
      return;
    }

    const deletePromises = completedTodos.map(todo => deleteTodo(todo.id));

    Promise.all(deletePromises)
      .then(() => {
        setTodos((currentTodos: Todo[] | null) => {
          if (!currentTodos) {
            return null;
          }
          return currentTodos.filter(todo => !todo.completed);
        });
      })
      .catch(() => {
        setErrorMessage('Unable to delete completed todos');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const hasTodos = todos?.length !== 0;
  const vidibleTodos = useMemo(() => getPreperadTodos(todos, filterBy), [todos, filterBy]);
  const activeTodosLength = useMemo(() => todos!.filter(todo => !todo.completed).length, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {hasTodos && (
            <button type="button" className="todoapp__toggle-all active" />
          )}

          <TodoForm
            loading={loading}
            addTodo={(newTodo) => addTodo(newTodo)}
            userId={USER_ID}
            setNotification={setErrorMessage}
            tempTodo={tempTodo}
          />
        </header>

        {hasTodos && (
          <section className="todoapp__main">
            <TodoList
              todos={vidibleTodos}
              tempTodo={tempTodo}
              removeTodo={deleteTodo}
              removingId={removingId}
            />
          </section>
        )}

        {hasTodos && (
          <TodoFooter
            todos={vidibleTodos}
            activeTodos={activeTodosLength}
            filterBy={filterBy}
            onFilterBy={setFilterBy}
            removeCompleted={deleteCompletedTodo}
          />
        )}
      </div>

      {isError && (
        <TodoNotification
          isError={isError}
          errorMessage={errorMessage}
          setNotification={setErrorMessage}
        />
      )}
    </div>
  );
};
