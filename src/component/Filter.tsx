import React from 'react';
import cn from 'classnames';

import { SelectedCategory } from '../types/SelectedCategory';

type Props = {
  category: SelectedCategory;
  onClick: (selectedCategory: SelectedCategory) => void,
};

export const Filter: React.FC<Props> = ({ category, onClick }) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: category === SelectedCategory.All,
        })}
        onClick={() => onClick(SelectedCategory.All)}
      >
        {SelectedCategory.All}
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: category === SelectedCategory.Active,
        })}
        onClick={() => onClick(SelectedCategory.Active)}
      >
        {SelectedCategory.Active}
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: category === SelectedCategory.Completed,
        })}
        onClick={() => onClick(SelectedCategory.Completed)}
      >
        {SelectedCategory.Completed}
      </a>
    </nav>
  );
};
