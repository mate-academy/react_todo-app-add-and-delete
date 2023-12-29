import React, { useMemo, useState } from 'react';
import { TodosList } from './components/TodosList';
import { FilterBy, TodosFooter } from './components/TodosFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoHeader } from './components/TodoHeader';
import { useDispatch, useSelector } from './providers/TodosContext';
import { filterTodos } from './helpers/filterTodo';

export const App: React.FC = () => {
  const {
    todos,
    isError,
    errorMessage,
  } = useSelector();
  const dispatch = useDispatch();

  const [filterBy, setFilterBy] = useState<FilterBy>('all');

  const preparedTodos = useMemo(() => {
    return filterTodos(todos, filterBy);
  }, [filterBy, todos]);

  const completedTodosLength = useMemo(() => {
    return todos.filter(
      ({ completed }) => completed,
    ).length;
  }, [todos]);
  const activeTodosLength = todos.length - completedTodosLength;
  const isSomeActive = todos.some(({ completed }) => !completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader isSomeActive={isSomeActive} />

        <TodosList todos={preparedTodos} />

        {todos.length > 0 && (
          <TodosFooter
            filterBy={filterBy}
            activeTodosLength={activeTodosLength}
            completedTodosLength={completedTodosLength}
            onFilterChange={setFilterBy}
          />
        )}
      </div>

      <ErrorNotification
        isHidden={!isError}
        message={errorMessage}
        onClose={
          () => dispatch({ type: 'setError', payload: { isError: false } })
        }
      />
    </div>
  );
};
