import React from 'react';
import classNames from 'classnames';
import { TodoCompletionType } from '../../types/TodoCompletionType';

type Props = {
  isSelected: boolean;
  filterOption: TodoCompletionType;
  onFilterSelect: (newFilterOption: TodoCompletionType) => void
};

export const FilterButton: React.FC<Props> = ({
  isSelected,
  filterOption,
  onFilterSelect,
}) => {
  const href = filterOption === TodoCompletionType.All
    ? '#/'
    : `#/${filterOption}`;

  return (
    <a
      href={href}
      className={classNames(
        'filter__link',
        {
          selected: isSelected,
        },
      )}
      onClick={() => onFilterSelect(filterOption)}
    >
      {filterOption}
    </a>
  );
};
