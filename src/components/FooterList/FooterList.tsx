import { FooterType } from '../../types/FooterType';
import filters from '../../api/filtered.json';
import { FooterItem } from '../FooterItem/FooterItem';

export const FooterList = ({
  todosItemsList,
  filtered,
  onFiltred,
  onDeleteAll,
}: FooterType) => {
  if (todosItemsList.length === 0) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosItemsList.filter(item => !item.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(item => (
          <FooterItem
            key={item.id}
            filter={item}
            filtered={filtered}
            onFiltred={onFiltred}
          />
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todosItemsList.filter(item => item.completed).length === 0}
        onClick={() => {
          onDeleteAll();
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
