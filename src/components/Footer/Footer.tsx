import React, { useCallback, useContext } from 'react';
import classNames from 'classnames';

import { deleteTodo } from '../../api/todos';
import { AppContext } from '../AppContext';
import { TodosFilter } from '../TodosFilter';

export const Footer: React.FC = () => {
  const {
    allTodos,
    setAllTodos,
    activeTodos,
    completedTodosIds,
    loadingTodosIds,
    setLoadingTodosIds,
    showError,
    setShouldShowError,
  } = useContext(AppContext);

  const clearCompletedTodos = useCallback(async () => {
    setShouldShowError(false);
    setLoadingTodosIds(prevIds => [...prevIds, ...completedTodosIds]);

    try {
      await Promise.all(completedTodosIds.map(id => deleteTodo(id)));

      setAllTodos(activeTodos);
    } catch {
      showError('Unable to delete all completed todos');
    } finally {
      setLoadingTodosIds([0]);
    }
  }, [loadingTodosIds, allTodos]);

  const handleClearCompletedTodosButtonClick = () => {
    clearCompletedTodos();
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <TodosFilter />

      <button
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { 'is-invisible': !completedTodosIds.length },
        )}
        onClick={handleClearCompletedTodosButtonClick}
      >
        Clear completed
      </button>
    </footer>
  );
};
