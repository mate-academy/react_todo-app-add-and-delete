import classNames from 'classnames';
import { useEffect } from 'react';
import { Filter } from '../../enums/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[] | undefined,
  statusTodosHandler: (value: string) => void,
  selected: Filter,
  setSelected: (value: Filter) => void,
};

export const TodoFilter: React.FC<Props> = ({
  todos,
  statusTodosHandler,
  selected,
  setSelected,
}) => {
  useEffect(() => {
    statusTodosHandler(selected);
  }, [selected, todos]);

  return (
    <nav className="filter">
      {Object.values(Filter).map(element => (
        <a
          key={element}
          href={`#/${element !== 'all' && element}`}
          className={classNames('filter__link', {
            selected: selected === element,
          })}
          onClick={() => setSelected(element)}
        >
          {`${element[0].toUpperCase()}${element.slice(1, element.length)}`}
        </a>
      ))}
    </nav>
  );
};
