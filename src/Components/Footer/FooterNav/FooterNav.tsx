import cn from 'classnames';
import { useTodoContext } from '../../../Context/Context';
import { States } from '../../../types/Todo';

export const FooterNav = () => {
  const { selectedOption, setSelectedOption } = useTodoContext();

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link',
          { selected: selectedOption === States.All })}
        data-cy="FilterLinkAll"
        onClick={() => setSelectedOption(States.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link',
          { selected: selectedOption === States.Active })}
        data-cy="FilterLinkActive"
        onClick={() => setSelectedOption(States.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link',
          { selected: selectedOption === States.Completed })}
        data-cy="FilterLinkCompleted"
        onClick={() => setSelectedOption(States.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
