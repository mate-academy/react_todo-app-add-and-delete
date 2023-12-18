import React,
{
  useCallback, useContext, useEffect, useMemo,
} from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { FilterBy } from './types/FilterBy';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorType } from './types/ErrorType';
import { ErrorInfo } from './components/ErrorInfo/ErrorInfo';
import { filterTodos } from './helpers/filterTodos';
import { USER_ID } from './utils/userId';
import { AppContext } from './contexts/appContext';

export const App: React.FC = () => {
  const {
    todosFromServer,
    filterBy,
    setTodosFromServer,
    setErrorMessage,
  } = useContext(AppContext);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodosFromServer)
      .catch(() => setErrorMessage(ErrorType.UnableToLoad));
  }, [setTodosFromServer, setErrorMessage]);

  const memoizedFilterTodos = useCallback(
    (
      todos: Todo[],
      filterByOption: FilterBy,
    ) => filterTodos(todos, filterByOption),
    [],
  );

  const todosToView = useMemo(
    () => memoizedFilterTodos(todosFromServer, filterBy),
    [memoizedFilterTodos, todosFromServer, filterBy],
  );

  const isEveryTodosCompleted = todosToView.every(
    todo => todo.completed,
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header isEveryTodosCompleted={isEveryTodosCompleted} />

        <TodoList todosToView={todosToView} />

        {todosFromServer.length > 0 && (
          <Footer />
        )}
      </div>

      <ErrorInfo />
    </div>
  );
};
