import cn from 'classnames';

enum FiltersParam {
  All = 'All',
  Completed = 'Completed',
  Active = 'Active',
}

type Props = {
  allTodosCount: number;
  todoLeft: number;
  filter: FiltersParam;
  setFilter: (newFilter: FiltersParam) => void;
  onDeleteCompletedTodos: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  allTodosCount,
  todoLeft,
  filter,
  setFilter,
  onDeleteCompletedTodos,
}) => {
  const filterItems = [
    {
      label: 'All',
      href: '#/',
      value: FiltersParam.All,
      dataCy: 'FilterLinkAll',
    },
    {
      label: 'Active',
      href: '#/active',
      value: FiltersParam.Active,
      dataCy: 'FilterLinkActive',
    },
    {
      label: 'Completed',
      href: '#/completed',
      value: FiltersParam.Completed,
      dataCy: 'FilterLinkCompleted',
    },
  ];

  function handleDeleteCompletedTodos() {
    onDeleteCompletedTodos();
  }

  return (
    <>
      {/* Hide the footer if there are no todos */}
      {allTodosCount !== 0 && (
        <footer
          className={cn('todoapp__footer', { hidden: allTodosCount === 0 })}
          data-cy="Footer"
        >
          <span className="todo-count" data-cy="TodosCounter">
            {todoLeft} items left
          </span>

          {/* Active link should have the 'selected' class */}
          <nav className="filter" data-cy="Filter">
            {filterItems.map(item => (
              <a
                key={item.value}
                href={item.href}
                className={cn('filter__link', {
                  selected: filter === item.value,
                })}
                data-cy={item.dataCy}
                onClick={() => setFilter(item.value)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* this button should be disabled if there are no completed todos */}
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            disabled={allTodosCount - todoLeft === 0}
            onClick={handleDeleteCompletedTodos}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
