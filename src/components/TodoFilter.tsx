import cn from 'classnames';
import { FilterCases } from '../types/FilterCases';
import { getLinkText } from '../utils/helper';

type TodoFilterProps = {
  onLinkClick: (filter: FilterCases) => void,
  currentFilter: FilterCases
};

const filterLinks = Object.values(FilterCases);

export const TodoFilter: React.FC<TodoFilterProps> = ({
  onLinkClick,
  currentFilter,
}) => {
  return (
    <nav className="filter">
      {filterLinks.map(filterLink => {
        const isSelected = currentFilter === filterLink;

        return (
          (
            <a
              key={filterLink}
              href={`#/${filterLink}`}
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
