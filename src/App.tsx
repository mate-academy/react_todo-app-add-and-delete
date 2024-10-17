/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useEffect, useMemo, useState } from 'react';

import { Todo } from './types/Todo';
import { Errors } from './types/Errors';
import { FilterBy } from './types/FilterBy';

import { getFilteredTodos } from './utils/getFilteredTodos';
import { handleFetchTodos } from './utils/handleFetchTodos';
import { handleDeleteTodos } from './utils/handleDeleteTodos';

import { Header, TodoList, Footer, ErrorMessage, TodoItem } from './components';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<Errors>(Errors.DEFAULT);
  const [idsForDelete, setIdsForDelete] = useState<number[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterBy>(FilterBy.ALL);

  const completedTodosId = useMemo(() => {
    return getFilteredTodos(todos, FilterBy.COMPLETED).map(todo => todo.id);
  }, [todos]);

  const numberOfActiveTodos = useMemo(() => {
    return getFilteredTodos(todos, FilterBy.ACTIVE).length;
  }, [todos]);

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todos, selectedFilter);
  }, [todos, selectedFilter]);

  useEffect(() => {
    if (idsForDelete.length) {
      handleDeleteTodos(idsForDelete, setTodos, setIdsForDelete, setError);
    }
  }, [idsForDelete]);

  useEffect(() => {
    handleFetchTodos(setTodos, setError);
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          tempTodo={tempTodo}
          setTodos={setTodos}
          setError={setError}
          setTempTodo={setTempTodo}
        />

        <TodoList
          todos={filteredTodos}
          idsForDelete={idsForDelete}
          setIdsForDelete={setIdsForDelete}
        />

        {tempTodo && (
          <TodoItem todo={tempTodo} setIdsForDelete={setIdsForDelete} />
        )}

        {!!todos.length && (
          <Footer
            selectedFilter={selectedFilter}
            completedTodosId={completedTodosId}
            numberOfActiveTodos={numberOfActiveTodos}
            setSelectedFilter={setSelectedFilter}
            setIdsForDelete={setIdsForDelete}
          />
        )}
      </div>

      <ErrorMessage error={error} setError={setError} />
    </div>
  );
};
