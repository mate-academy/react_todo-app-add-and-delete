import React from 'react';
import cn from 'classnames';

import { SelectedCategory } from '../types/SelectedCategory';

type Props = {
  category: SelectedCategory;
  onClick: (selectedCategory: SelectedCategory) => void,
};

export const Filter: React.FC<Props> = ({ category, onClick }) => {
  const onCategorySelect = (cat: SelectedCategory) => {
    onClick(cat);
  };

  return (
    <nav className="filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: category === SelectedCategory.All,
        })}
        onClick={() => onCategorySelect(SelectedCategory.All)}
      >
        {SelectedCategory.All}
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: category === SelectedCategory.Active,
        })}
        onClick={() => onCategorySelect(SelectedCategory.Active)}
      >
        {SelectedCategory.Active}
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: category === SelectedCategory.Completed,
        })}
        onClick={() => onCategorySelect(SelectedCategory.Completed)}
      >
        {SelectedCategory.Completed}
      </a>
    </nav>
  );
};
