import { FC, useEffect, useMemo, useState } from 'react';

import { FilterOptions } from './utils/FilterOptions';
import { getFilteredTodos } from './utils/GetFilteredTodos';
import { handleError } from './utils/HandleError';
import { handleDeleteTodo } from './utils/HandleDeleteTodo';

import { getTodos } from './api/todos';
import { ToodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';

import { ErrorMessages } from './types/ErrorMessages';
import { Todo } from './types/Todo';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<ErrorMessages>(ErrorMessages.None);
  const [idsForDelete, setIdsForDelete] = useState<number[]>([]);
  const [filterOption, setFilterOption] = useState<FilterOptions>(
    FilterOptions.All,
  );

  if (idsForDelete.length !== 0) {
    handleDeleteTodo(idsForDelete, setTodos, setIdsForDelete, setError);
  }

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => handleError(setError, ErrorMessages.LoadFail));
  }, []);

  const completedTodosId = useMemo(() => {
    return todos.filter(todo => todo.completed).map(todo => todo.id);
  }, [todos]);

  const numberOfActiveTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todos, filterOption);
  }, [todos, filterOption]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setTempTodo={setTempTodo}
          setError={setError}
          setTodos={setTodos}
          tempTodo={tempTodo}
          todos={todos}
        />

        {!!todos.length && (
          <>
            <ToodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              setIdsForDelete={setIdsForDelete}
              idsForDelete={idsForDelete}
            />
            <Footer
              setFilterOption={setFilterOption}
              filterOption={filterOption}
              numberOfActiveTodos={numberOfActiveTodos}
              completedTodosId={completedTodosId}
              setIdsForDelete={setIdsForDelete}
            />
          </>
        )}
      </div>

      <ErrorNotification error={error} />
    </div>
  );
};
