import { FC, memo, useContext } from 'react';
import { TodosContext } from './TodosContext';

export const TodosFooter: FC<{ todosCount: number }> = memo(({
  todosCount,
}) => {
  const {
    todos,
    setTodos,
    filterType,
    setFilterType,
  } = useContext(TodosContext);

  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const active = total - completed;

  return (
    <div className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={`filter__link ${
            filterType === 'all' ? 'selected'
              : ''} ${
            !total ? 'is-disabled' : ''}`}
          onClick={() => setFilterType('all')}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={`filter__link ${
            filterType === 'active' ? 'selected'
              : ''} ${
            !active ? 'is-disabled' : ''}`}
          onClick={() => setFilterType('active')}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={
            `filter__link ${
              filterType === 'completed' ? 'selected' : ''
            } ${
              !completed ? 'is-disabled' : ''
            }`
          }
          onClick={() => setFilterType('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={`todoapp__clear-completed ${
          !completed ? 'is-disabled' : ''
        }`}
        onClick={() => setTodos(prev => prev.filter(item => !item.completed))}
      >
        Clear completed
      </button>
    </div>
  );
});
