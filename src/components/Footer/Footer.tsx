import React, { useContext } from 'react';

import './Footer.scss';
import { TodosContext } from '../TodosContext';
import { TodosFilter } from '../TodosFilter';

export const Footer: React.FC = () => {
  const { todos, dispatch } = useContext(TodosContext);

  const notCompletedTodos = todos.filter(todo => !todo.completed);
  const notCompletedLength = notCompletedTodos.length;
  const completedLength = todos.length - notCompletedLength;

  const getItemsLeft = () => {
    return notCompletedLength === 1 ? (
      '1 item left'
    ) : (
      `${notCompletedLength} items left`
    );
  };

  const handleClearClick = () => {
    dispatch({
      type: 'clearAllCompleted',
      payload: notCompletedTodos,
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span data-cy="TodosCounter">
        {getItemsLeft()}
      </span>

      <TodosFilter />

      {!!completedLength && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleClearClick}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
