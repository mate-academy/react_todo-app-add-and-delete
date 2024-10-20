import React, { useEffect, useMemo, useState } from 'react';
import { getTodos } from './api/todos';

import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Errors } from './types/Errors';

import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './components/ErrorMessage';

import { handleError } from './utils/handleError';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { handleDeletion } from './utils/handleDeletion';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.Default);
  const [filterOption, setFilterOption] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletionIds, setDeletionIds] = useState<number[]>([]);

  const completedTodoIds = useMemo(() => {
    return todosFromServer.filter(todo => todo.completed).map(todo => todo.id);
  }, [todosFromServer]);

  const uncompletedTodosAmount = useMemo(() => {
    return todosFromServer.filter(todo => !todo.completed).length;
  }, [todosFromServer]);

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todosFromServer, filterOption);
  }, [todosFromServer, filterOption]);

  useEffect(() => {
    if (deletionIds.length) {
      handleDeletion(
        deletionIds,
        setTodosFromServer,
        setDeletionIds,
        setErrorMessage,
      );
    }
  }, [deletionIds]);

  useEffect(() => {
    getTodos()
      .then(setTodosFromServer)
      .catch(() => handleError(setErrorMessage, Errors.LoadingTodos));
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setTodos={setTodosFromServer}
          setError={setErrorMessage}
          setTempTodo={setTempTodo}
          tempTodo={tempTodo}
          uncompletedTodosAmount={uncompletedTodosAmount}
          todos={todosFromServer}
        />

        {!!todosFromServer.length && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              deletionIds={deletionIds}
              setDeletionIds={setDeletionIds}
            />
            <Footer
              filterOption={filterOption}
              completedTodoIds={completedTodoIds}
              uncompletedTodosAmount={uncompletedTodosAmount}
              setFilterOption={setFilterOption}
              setDeletionIds={setDeletionIds}
            />
          </>
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
