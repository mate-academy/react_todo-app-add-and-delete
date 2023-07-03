import cn from 'classnames';

type Props = {
  completionStatus: string,
  setCompletionStatus: (newStatus:string) => void;
};

export const TodoFilter:React.FC<Props> = ({
  completionStatus,
  setCompletionStatus,
}) => {
  const handleFilterClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const clickedStatus = event.currentTarget.textContent || '';

    setCompletionStatus(clickedStatus);
  };

  return (
    <nav className="filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: completionStatus === 'All',
        })}
        onClick={handleFilterClick}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: completionStatus === 'Active',
        })}
        onClick={handleFilterClick}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: completionStatus === 'Completed',
        })}
        onClick={handleFilterClick}
      >
        Completed
      </a>
    </nav>
  );
};
