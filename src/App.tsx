/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import cn from 'classnames';
import { FilterMethods } from './types/FilterMethods';
import { wait } from './utils/fetchClient';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodosId, setLoadingTodosId] = useState<number[]>([]);

  const addIdToLoad = (newId: number) => {
    setLoadingTodosId(prev => [...prev, newId]);
  };

  useEffect(() => {
    if (errorMessage) {
      wait(3000).then(() => setErrorMessage(''));
    } else {
      return;
    }
  }, [errorMessage]);

  const filteredTodos = todos.filter(todo => {
    switch (activeFilter) {
      case FilterMethods.All:
        return todo;
      case FilterMethods.ACTIVE:
        return !todo.completed;
      case FilterMethods.COMPLETED:
        return todo.completed;
      default:
        return todo;
    }
  });

  const handleOnClickFilter = (method: FilterMethods) => {
    setActiveFilter(method);
  };

  const handleOnClickCLearAll = async () => {
    const completedTodosId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    try {
      setLoadingTodosId(prev => [...prev, ...completedTodosId]);
      await Promise.all(completedTodosId.map(id => deleteTodo(id)));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      throw error;
    } finally {
      setLoadingTodosId([]);
      setTodos(todos.filter(todo => !todo.completed));
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          setTodos={setTodos}
          todos={todos}
          errorMessage={errorMessage}
          setLoadingTodosId={setLoadingTodosId}
          loadingTodosId={loadingTodosId}
          addIdToLoad={addIdToLoad}
        />

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            filteredTodos={filteredTodos}
            todos={todos}
            tempTodo={tempTodo}
            setLoadingTodosId={setLoadingTodosId}
            loadingTodosId={loadingTodosId}
            addIdToLoad={addIdToLoad}
          />
        </section>

        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: activeFilter === FilterMethods.All,
                })}
                data-cy="FilterLinkAll"
                onClick={() => handleOnClickFilter(FilterMethods.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: activeFilter === FilterMethods.ACTIVE,
                })}
                data-cy="FilterLinkActive"
                onClick={() => handleOnClickFilter(FilterMethods.ACTIVE)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: activeFilter === FilterMethods.COMPLETED,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => handleOnClickFilter(FilterMethods.COMPLETED)}
              >
                Completed
              </a>
            </nav>
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleOnClickCLearAll}
              disabled={todos.find(todo => todo.completed) === undefined}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
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
