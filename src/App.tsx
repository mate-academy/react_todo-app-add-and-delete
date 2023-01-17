import {
  FC, useContext, useEffect, useState, useMemo,
} from 'react';
import classNames from 'classnames';

import { getTodos, removeTodo, updateTodoStatus } from './api/todos';
import { Todo } from './types/Todo';
import { TodoErrors } from './types/ErrorMessages';
import { FilterOptions } from './types/FilterOptions';

import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { Filter } from './components/Filter/Filter';
import { ErrorNotification }
  from './components/ErrorNotification/ErrorNotification';

export const App: FC = () => {
  const user = useContext(AuthContext);
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterOptions>(FilterOptions.All);
  const [errorText, setErrorText] = useState<TodoErrors>(TodoErrors.none);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTodosFromServer = async (id: number) => {
      try {
        const todos = await getTodos(id);

        setTodosFromServer(todos);
        setIsLoading(false);
      } catch (error) {
        setErrorText(TodoErrors.onLoad);
      }
    };

    if (user && isLoading) {
      loadTodosFromServer(user.id);
    }
  }, [isLoading]);

  const visibleTodos = useMemo(() => {
    switch (filterBy) {
      case FilterOptions.Active:
        return todosFromServer.filter(todo => !todo.completed);
      case FilterOptions.Completed:
        return todosFromServer.filter(todo => todo.completed);
      case FilterOptions.All:
      default:
        return todosFromServer;
    }
  }, [todosFromServer, filterBy]);

  const getTodosByCompletion = (todos: Todo[], isDone: boolean) => {
    return todos.filter(todo => todo.completed === isDone);
  };

  const completedTodos = getTodosByCompletion(todosFromServer, true);

  const hadleDeleteCompleted = () => {
    const deletePromises = getTodosByCompletion(visibleTodos, true)
      .map(todo => removeTodo(todo.id));

    Promise.all(deletePromises).then(() => {
      setIsLoading(true);
    });
  };

  const handleToggleAll = () => {
    const isAllDone = completedTodos.length === todosFromServer.length;
    const updatePromises = getTodosByCompletion(visibleTodos, isAllDone)
      .map(todo => updateTodoStatus(todo.id, !todo.completed));

    Promise.all(updatePromises).then(() => {
      setIsLoading(true);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onError={setErrorText}
          setIsLoading={setIsLoading}
          onCompleteAll={handleToggleAll}
        />

        {todosFromServer.length > 0 && (
          <>
            <TodoList
              visibleTodos={visibleTodos}
              setIsLoading={setIsLoading}
              setErrorMessage={setErrorText}
            />
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {`${todosFromServer.length} items left`}
              </span>

              <Filter
                currentFilter={filterBy}
                onFilterChange={setFilterBy}
              />
              <button
                data-cy="ClearCompletedButton"
                type="button"
                className={classNames(
                  'todoapp__clear-completed',
                  {
                    'todoapp__clear-completed--hidden': !completedTodos.length,
                  },
                )}
                onClick={hadleDeleteCompleted}
              >
                Clear completed
              </button>
            </footer>

          </>
        )}
      </div>
      <ErrorNotification
        message={errorText}
        handleSkipErrorClick={setErrorText}
      />
    </div>
  );
};
