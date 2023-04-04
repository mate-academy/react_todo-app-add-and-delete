import classNames from 'classnames';
import { useEffect } from 'react';

type Props = {
  statusTodosHandler: (value: string) => void,
  selected: string,
  setSelected: (value: string) => void,
};

export const TodoFilter: React.FC<Props> = ({
  statusTodosHandler,
  selected,
  setSelected,
}) => {
  useEffect(() => {
    statusTodosHandler(selected);
  }, [selected]);

  const changeStatus = (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    if (event.currentTarget.textContent) {
      setSelected(event.currentTarget.textContent.toLowerCase());
    }
  };

  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: selected === 'all',
        })}
        onClick={changeStatus}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: selected === 'active',
        })}
        onClick={changeStatus}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: selected === 'completed',
        })}
        onClick={changeStatus}
      >
        Completed
      </a>
    </nav>
  );
};
