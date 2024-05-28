import React, { useContext } from 'react';
import { DispatchContext, TodoContext } from './TodoContext';
import { SortingTodos } from '../types/Sorting';
import classNames from 'classnames';
import { deleteTodoFromServer } from '../api/todos';

export const Footer: React.FC = () => {
  const { dispatch } = useContext(DispatchContext);
  const { todos, tab } = useContext(TodoContext);
  const todosCounter = todos.filter(todo => !todo.completed && !todo.isLoading);
  const handleClearTodos = () => {
    const todosCompleted = todos.filter(todo => todo.completed);
    const res = todosCompleted.map(todo => {
      deleteTodoFromServer(todo.id).then(() => {
        Promise.all(res).then(() => {
          dispatch({ type: 'clearCompleted' });
        });
      });
    });
  };

  const handleActiveTab = (activeTab: SortingTodos) => {
    dispatch({
      type: 'activeTab',
      payload: { tab: activeTab },
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCounter.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: tab === SortingTodos.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => {
            handleActiveTab(SortingTodos.all);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: tab === SortingTodos.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => {
            handleActiveTab(SortingTodos.active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: tab === SortingTodos.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            handleActiveTab(SortingTodos.completed);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearTodos}
        disabled={todos.filter(todo => todo.completed).length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
