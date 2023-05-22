import React, { memo } from 'react';
import classNames from 'classnames';
import { Category } from '../../types/Category';

interface Props {
  filterCategory: Category;
  changeCategory: (category: Category) => void;
}

export const TodoFilter: React.FC<Props> = memo(({
  filterCategory,
  changeCategory,
}) => (
  <nav className="filter">
    <a
      href="#/"
      className={classNames(
        'filter__link', { selected: filterCategory === Category.All },
      )}
      onClick={() => changeCategory(Category.All)}
    >
      All
    </a>

    <a
      href="#/active"
      className={classNames(
        'filter__link',
        { selected: filterCategory === Category.Active },
      )}
      onClick={() => changeCategory(Category.Active)}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={classNames(
        'filter__link',
        { selected: filterCategory === Category.Completed },
      )}
      onClick={() => changeCategory(Category.Completed)}
    >
      Completed
    </a>
  </nav>
));
