/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import { useAppContext } from '../../context/AppContext';

import { useRemoveCompletedTodos } from '../../utils/todoHandlers';

import { Filter } from './Filter/Filter';

export const FilteringPanel: React.FC = () => {
  const { todos } = useAppContext();
  const [isDisabledClearButton, setIsDisabledClearButton] = useState(true);
  const [removalError, setRemovalError] = useState(false);
  const notCompletedTodosLength = todos.filter(
    todo => !todo.completed && todo.id !== 0,
  ).length;

  const removeCompletedTodos = useRemoveCompletedTodos();

  function handleRemoveCompletedTodos() {
    removeCompletedTodos(setRemovalError);
  }

  useEffect(() => {
    setIsDisabledClearButton(
      !todos.some(todo => todo.completed) && !removalError,
    );
  }, [todos]);

  return (
    <footer className="todoapp__filtering-panel" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedTodosLength} items left
      </span>

      <Filter />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={isDisabledClearButton}
        onClick={handleRemoveCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
