/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { Todos } from './components/Todos';
import { SelectedFilter } from './types/SelectedFilter';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { ErrorMessages } from './types/ErrorMessages';
import classNames from 'classnames';

function prepareTodos(todos: Todo[], filterQuery: SelectedFilter) {
  let visibleTodos = [...todos];

  switch (filterQuery) {
    case 'active':
      visibleTodos = visibleTodos.filter(todo => !todo.completed);
      break;
    case 'completed':
      visibleTodos = visibleTodos.filter(todo => todo.completed);
      break;
    case 'all':
      break;
  }

  return visibleTodos;
}

const ERROR_MESSAGE_TIMEOUT = 3000;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterQuery, setFilterQuery] = useState<SelectedFilter>('all');
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.None,
  );
  const [query, setQuery] = useState('');
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
  };

  const handleSelect = (newFilterQuery: SelectedFilter) => {
    setFilterQuery(newFilterQuery);
  };

  const handleError = (message: ErrorMessages) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(ErrorMessages.None);
    }, ERROR_MESSAGE_TIMEOUT);
  };

  const handleNewTodo = (title: string) => {
    setErrorMessage(ErrorMessages.None);
    setQuery(prev => prev.trim());
    if (!title) {
      handleError(ErrorMessages.ErrorEmptyTitle);

      return;
    }

    const newTodoData: Omit<Todo, 'id'> = {
      title: title,
      userId: USER_ID,
      completed: false,
    };

    addTodo(newTodoData)
      .then(({ id, userId, title: todoTitle, completed }) => {
        const newTodo = {
          id: id,
          userId: userId,
          title: todoTitle,
          completed: completed,
        };

        setTodos(prevTodos => [...prevTodos, newTodo]);
        setQuery('');
      })
      .catch(() => {
        handleError(ErrorMessages.ErrorToAddTodo);
      })
      .finally(() => {
        setTempTodo(null);
      });

    setTempTodo({
      id: 0,
      ...newTodoData,
    });
  };

  const handleTodoDelete = useCallback((id: number) => {
    setErrorMessage(ErrorMessages.None);
    setLoadingTodoIds(prev => [...prev, id]);
    deleteTodo(id)
      .then(() => {
        setTodos(prev => {
          const idIndex = prev.findIndex(elem => elem.id === id);

          return [...prev.slice(0, idIndex), ...prev.slice(idIndex + 1)];
        });
      })
      .catch(() => {
        handleError(ErrorMessages.ErrorToDeleteTodo);
      })
      .finally(() => {
        setLoadingTodoIds(prev => {
          const idIndex = prev.findIndex(elem => elem === id);

          return [...prev.slice(0, idIndex), ...prev.slice(idIndex + 1)];
        });
      });
  }, []);

  const handleAllCompletedDelete = () => {
    const ids = todos.filter(todo => todo.completed).map(todo => todo.id);

    ids.forEach(id => handleTodoDelete(id));
  };

  const handleDeleteError = () => {
    setErrorMessage(ErrorMessages.None);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        handleError(ErrorMessages.ErrorTodoLoad);
      });
  }, []);

  const isLoadingAddingTodo = tempTodo !== null;
  const isLoadingSomething = loadingTodoIds.length > 0;

  const visibleTodos = prepareTodos(todos, filterQuery);

  const remainingTodos = todos.reduce((acc, todo) => acc + +!todo.completed, 0);

  const areNoneCompleted = todos.every(todo => !todo.completed);
  const areAllCompleted = todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          areAllCompleted={areAllCompleted}
          adding={isLoadingAddingTodo}
          loading={isLoadingSomething}
          query={query}
          onQueryChange={handleQueryChange}
          onNewTodo={handleNewTodo}
        />

        <Todos
          todos={visibleTodos}
          loadingTodoIds={loadingTodoIds}
          tempTodo={tempTodo}
          onTodoDelete={handleTodoDelete}
        />

        {todos.length > 0 && (
          <Footer
            selected={filterQuery}
            itemCount={remainingTodos}
            areNoneCompleted={areNoneCompleted}
            onSelect={handleSelect}
            onCompletedDelete={handleAllCompletedDelete}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: errorMessage === ErrorMessages.None,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => handleDeleteError()}
        />
        {errorMessage !== ErrorMessages.None && errorMessage}
      </div>
    </div>
  );
};
