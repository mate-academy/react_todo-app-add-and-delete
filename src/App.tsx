/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import { AppList } from './components/TodoList';
import { Footer } from './components/Footer';
import { AddForm } from './components/AddForm';
import { createTodo, deleteTodo, getTodos } from './services/todos';
import { ErrorType } from './types/Error';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Notifications } from './components/Notifications';
import { getPreparedTodos } from './services/PrepepareTodos';

export const USER_ID = 11223;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletedTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    getTodos(USER_ID)
      .then((data) => {
        setTodos(data);
      })
      .catch(() => {
        setErrorMessage(ErrorType.fetchTodo);
      });
  }, []);

  const resetError = () => {
    setErrorMessage('');
  };

  const filteredTodos = useMemo(() => getPreparedTodos(
    todos,
    filter,
  ), [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = (newTitle: string) => {
    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: newTitle,
      completed: false,
    };

    setIsLoading(true);

    return createTodo(newTodo)
      .then((createdTodo) => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setErrorMessage('');
        setIsLoading(false);
      })
      .catch(() => {
        setErrorMessage(ErrorType.addTodo);
        setIsLoading(false);
      });
  };

  const removeTodo = (todoId: number) => {
    setDeletingTodoId(todoId);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
        setErrorMessage('');
      })
      .catch(() => {
        setErrorMessage(ErrorType.deleteTodo);
      })
      .finally(() => {
        setDeletingTodoId(null);
      });
  };

  const completedItems = todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: completedItems,
            })}
          />

          <AddForm
            onSubmit={addTodo}
            title={title}
            setTitle={setTitle}
            setError={setErrorMessage}
          />
        </header>

        <AppList
          todos={filteredTodos}
          onDelete={removeTodo}
          isDeleted={deletedTodoId}
          isLoading={isLoading}
          title={title}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            setFilter={setFilter}
            onClear={removeTodo}
          />
        )}
      </div>

      <Notifications
        error={errorMessage}
        reset={resetError}
      />
    </div>
  );
};
