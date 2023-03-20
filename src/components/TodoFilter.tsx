import cn from 'classnames';
import { FilterCases } from '../types/FilterCases';

type TodoFilterProps = {
  onLinkClick: (filter: FilterCases) => void,
  currentFilter: FilterCases
};

const filterLinks = Object.values(FilterCases);

const getLinkText = (filter: FilterCases) => {
  switch (filter) {
    case FilterCases.All:
      return 'All';

    case FilterCases.Active:
      return 'Active';

    case FilterCases.Completed:
      return 'Completed';

    default:
      return 'All';
  }
};

export const TodoFilter: React.FC<TodoFilterProps> = ({
  onLinkClick,
  currentFilter,
}) => {
  return (
    <nav
      className="filter"
    >
      {filterLinks.map(filterLink => {
        const isSelected = currentFilter === filterLink;

        return (
          (
            <a
              key={filterLink}
              href={filterLink}
              className={cn(
                'filter__link',
                {
                  selected: isSelected,
                },
              )}
              onClick={() => onLinkClick(filterLink)}
            >
              {getLinkText(filterLink)}
            </a>
          )
        );
      })}
    </nav>
  );
};
