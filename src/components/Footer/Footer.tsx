import classNames from 'classnames';
import { FC, FormEvent } from 'react';
import { Filter, useTodos } from '../../providers';

export const Footer: FC = () => {
  const {
    allTodos,
    completedTodos,
    activeTodos,
    filter,
    setFilter,
    onDeleteTodo,
  } = useTodos();

  const handleSetFilter = (f: Filter) => (e: FormEvent) => {
    e.preventDefault();
    setFilter(f);
  };

  const handleDeleteCompleted = () =>
    onDeleteTodo(...completedTodos.map(t => t.id));

  if (!allTodos.length) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', { selected: filter === 'all' })}
          data-cy="FilterLinkAll"
          onClick={handleSetFilter('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={handleSetFilter('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={handleSetFilter('completed')}
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos.length}
        onClick={handleDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
