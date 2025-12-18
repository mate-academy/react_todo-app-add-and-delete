import classNames from 'classnames';
import { FilterBtn } from '../../types/Filter';

interface FooterItemProps {
  filter: {
    id: string;
    name: FilterBtn;
    useFulName: string;
    test: string;
  };
  filtered: FilterBtn;
  onFiltred: (filter: FilterBtn) => void;
}

export const FooterItem = ({
  filter,
  filtered,
  onFiltred,
}: FooterItemProps) => {
  return (
    <a
      href={`#/${filter.useFulName}`}
      className={classNames('filter__link', {
        selected: filtered === filter.name,
      })}
      data-cy={filter.test}
      onClick={() => onFiltred(filter.name as FilterBtn)}
    >
      {filter.name}
    </a>
  );
};
