/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { Filter } from './types/EnumFilter';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Error } from './types/EnumError';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [todosAreLoadingIds, setTodosAreLoadingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const showError = (error: string) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        showError(Error.load);
      });
  }, []);

  const completedTodosId = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  const todosActiveIds = useMemo(() => {
    return todos.filter(todo => !todo.completed).map(todo => todo.id);
  }, [todos]);

  const handleDeleteTodo = (id: number) => {
    setTodosAreLoadingIds(currentTodosAreLoadingIds => [
      ...currentTodosAreLoadingIds,
      id,
    ]);
    deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        showError(Error.delete);
      })
      .finally(() => setTodosAreLoadingIds([]));
  };

  const filteredTodos = todos.filter(({ completed }) => {
    switch (filter) {
      case Filter.active:
        return !completed;

      case Filter.completed:
        return completed;

      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          showError={showError}
          setTempTodo={setTempTodo}
          tempTodo={tempTodo}
        />

        <TodoList
          todos={filteredTodos}
          onDelete={handleDeleteTodo}
          todosAreLoadingIds={todosAreLoadingIds}
          tempTodo={tempTodo}
        />

        {!!todos.length && (
          <Footer
            filter={filter}
            onFilter={setFilter}
            completedTodosId={completedTodosId}
            todosActiveIds={todosActiveIds}
            onDelete={handleDeleteTodo}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
