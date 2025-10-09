import React from 'react';
import cn from 'classnames';
import { TodoFilterMethod } from '../../types/Todo';

type Props = {
  currentMethod: TodoFilterMethod;
  onSelect: (method: TodoFilterMethod) => void;
};

const Filter: React.FC<Props> = ({ currentMethod, onSelect }: Props) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.entries(TodoFilterMethod)
        .filter(([key]) => key !== 'Default')
        .map(([, method]) => (
          <a
            key={method}
            href="#/"
            onClick={() => onSelect(method as TodoFilterMethod)}
            className={cn('filter__link', {
              selected: method === currentMethod,
            })}
            data-cy={`FilterLink${method}`}
          >
            {method}
          </a>
        ))}
    </nav>
  );
};

export default React.memo(Filter);
