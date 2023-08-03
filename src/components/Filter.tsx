/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable max-len */
import classNames from 'classnames';
import { SelectedCategory } from '../types/SelectedCategory';

interface Props {
  category: SelectedCategory,
  onClick: (selectedCategory: SelectedCategory) => void,
}

export const Filter: React.FC<Props> = ({
  category, onClick,
}) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: category === SelectedCategory.All,
        })}
        onClick={() => onClick(SelectedCategory.All)}
      >
        {SelectedCategory.All}
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: category === SelectedCategory.Active,
        })}
        onClick={() => onClick(SelectedCategory.Active)}
      >
        {SelectedCategory.Active}
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: category === SelectedCategory.Completed,
        })}
        onClick={() => onClick(SelectedCategory.Completed)}
      >
        {SelectedCategory.Completed}
      </a>
    </nav>
  );
};
