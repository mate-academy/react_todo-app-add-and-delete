import React, { useMemo, useState } from 'react';
import { Todo } from './types/Todo';
import { TodosList } from './components/TodosList';
import { FilterBy, TodosFooter } from './components/TodosFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoHeader } from './components/TodoHeader';
import { useDispatch, useSelector } from './providers/TodosContext';

const filterTodos = (todos: Todo[], filterBy: FilterBy) => {
  switch (filterBy) {
    case 'active':
      return todos.filter(({ completed }) => !completed);

    case 'completed':
      return todos.filter(({ completed }) => completed);

    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const {
    todos: todosFromServer,
    isError,
    errorMessage,
  } = useSelector();
  const dispatch = useDispatch();

  const [filterBy, setFilterBy] = useState<FilterBy>('all');

  const todos = useMemo(() => {
    return filterTodos(todosFromServer, filterBy);
  }, [filterBy, todosFromServer]);

  const completedTodosLength = useMemo(() => {
    return todosFromServer.filter(
      ({ completed }) => completed,
    ).length;
  }, [todosFromServer]);
  const activeTodosLength = todosFromServer.length - completedTodosLength;
  const isSomeActive = todos.some(({ completed }) => !completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader isSomeActive={isSomeActive} />

        <TodosList todos={todos} />

        {todosFromServer.length > 0 && (
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
