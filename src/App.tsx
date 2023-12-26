import React, {
  useCallback, useContext, useEffect, useMemo,
} from 'react';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { Footer } from './components/Footer';
import { FilterBy } from './types/Filter';
import { TodoList } from './components/TodoList';
import { filterTodo } from './helpers/filterTodo';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { ErrorType } from './types/Errors';
import { Notifications } from './components/Errors';
import { USER_ID } from './utils/userId';
import { AppContext } from './AppContext';

export const App: React.FC = () => {
  const {
    todos,
    setTodos,
    filterBy,
    setErrorMessage,
  } = useContext(AppContext);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorType.UnableToLoadTodo));
  }, [setErrorMessage, setTodos]);

  const selectFilterTodo = useCallback(
    (
      todosFromServer: Todo[],
      optionByFilter: FilterBy,
    ) => filterTodo(todosFromServer, optionByFilter),
    [],
  );

  const preparedTodos = useMemo(
    () => selectFilterTodo(todos, filterBy),
    [selectFilterTodo, todos, filterBy],
  );

  const isEveryTodosCompleted = preparedTodos.every(
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

        <TodoList todos={preparedTodos} />

        {todos.length > 0 && (
          <Footer />
        )}

      </div>

      <Notifications />
    </div>
  );
};
