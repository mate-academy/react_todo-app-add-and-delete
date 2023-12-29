import React, { useMemo, useState } from 'react';
import { TodosList } from './components/TodosList';
import { FILTERS, TodosFooter } from './components/TodosFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoHeader } from './components/TodoHeader';
import { useDispatch, useSelector } from './providers/TodosContext';
import { filterTodos } from './helpers/filterTodo';
import { deleteTodo } from './api/todos';

export const App: React.FC = () => {
  const {
    todos,
    inProcess,
    isError,
    errorMessage,
    updateTodos,
  } = useSelector();
  const dispatch = useDispatch();

  const [filterBy, setFilterBy] = useState<FILTERS>(FILTERS.All);

  const preparedTodos = useMemo(() => {
    return filterTodos(todos, filterBy);
  }, [filterBy, todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(
      ({ completed }) => completed,
    );
  }, [todos]);
  const activeTodosLength = todos.length - completedTodos.length;
  const isSomeActive = todos.some(({ completed }) => !completed);

  const handleDeleteCompleted = () => {
    const completedIds = completedTodos.map(({ id }) => (id));

    dispatch({
      type: 'setInProcess',
      payload: [...inProcess, ...completedIds],
    });
    Promise.all(completedIds.map((id) => deleteTodo(id)))
      .then(() => {
        updateTodos();
      })
      .catch(() => {
        dispatch({
          type: 'setError',
          payload: { isError: true, errorMessage: 'Unable to delete a todo' },
        });
      })
      .finally(() => {
        dispatch({
          type: 'setInProcess',
          payload: [],
        });
      });
  };

  const handleCloseNotification = () => {
    dispatch({ type: 'setError', payload: { isError: false } });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader isSomeActive={isSomeActive} />

        <TodosList todos={preparedTodos} />

        {!!todos.length && (
          <TodosFooter
            filterBy={filterBy}
            activeTodosLength={activeTodosLength}
            completedTodosLength={completedTodos.length}
            onFilterChange={setFilterBy}
            onDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      <ErrorNotification
        isHidden={!isError}
        message={errorMessage}
        onClose={handleCloseNotification}
      />
    </div>
  );
};
