import { Dispatch, SetStateAction, useState } from 'react';
import classNames from 'classnames';
import { FilterBy } from '../types/FilterBy';

interface Props {
  setFilterBy: Dispatch<SetStateAction<FilterBy>>,
  itemsQuantity: number,
}

export const TodoFooter: React.FC<Props> = ({ setFilterBy, itemsQuantity }) => {
  const navItems = [
    {
      title: 'All',
      id: 'ALL',
    },
    {
      title: 'Active',
      id: 'ACTIVE',
    },
    {
      title: 'Completed',
      id: 'COMPLETED',
    }];
  const [selectedType, setSelectedType] = useState('ALL');

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsQuantity} items left`}
      </span>

      <nav className="filter">
        {navItems.map((navItem) => (
          <a
            href="#/"
            id={navItem.id}
            className={classNames(
              'filter__link',
              {
                selected: selectedType === navItem.id,
              },
            )}
            key={navItem.id}
            onClick={() => {
              switch (navItem.id) {
                case FilterBy.ACTIVE:
                  setFilterBy(FilterBy.ACTIVE);
                  break;

                case FilterBy.COMPLETED:
                  setFilterBy(FilterBy.COMPLETED);
                  break;

                default:
                  setFilterBy(FilterBy.ALL);
                  break;
              }

              setSelectedType(navItem.id);
            }}
          >
            {navItem.title}
          </a>
        ))}
      </nav>

      <button type="button" className="todoapp__clear-completed">
        Clear completed
      </button>
    </footer>
  );
};
