import { useContext } from 'react';
import { DispatchContext, StatesContext } from '../context/Store';
import { Filter } from '../types/Filter';
import classNames from 'classnames';
import { deleteTodo } from '../api/todos';
import React from 'react';

export const Footer: React.FC = () => {
  const { todos, filter } = useContext(StatesContext);
  const dispatch = useContext(DispatchContext);
  const todosLeft = todos.filter(t => !t.completed);

  function handleFilterClick(selectedFilter: Filter) {
    dispatch({ type: 'setFilter', payload: selectedFilter });
  }

  const handleClearClick = () => {
    const completedTodos = todos.filter(t => t.completed);

    Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id).then(() => todo.id)),
    ).then(results => {
      if (results.some(res => res.status === 'rejected')) {
        dispatch({ type: 'showError', payload: 'Unable to delete a todo' });
      }

      return results
        .filter(
          (res): res is PromiseFulfilledResult<number> =>
            res.status === 'fulfilled',
        )
        .map(res => dispatch({ type: 'deleteTodo', payload: res.value }));
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosLeft.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleFilterClick(Filter.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleFilterClick(Filter.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleFilterClick(Filter.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => handleClearClick()}
        disabled={todos.length === 0 || !todos.some(t => t.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
