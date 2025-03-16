import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { Filter } from '../../enum/Filter';
import {
  completedTodoId,
  notCompletedTodoCounter,
} from '../../services/todoFunction';
import classNames from 'classnames';

type Props = {
  filterData: (value: Filter) => void;
  todos: Todo[];
  deleteTodos: (ids: number[]) => void;
};

export const Footer: React.FC<Props> = ({ filterData, todos, deleteTodos }) => {
  const [select, setSelect] = useState(Filter.All);

  const handleClick = (filter: Filter) => {
    setSelect(filter);
    filterData(filter);
  };

  const completedTodos = completedTodoId(todos);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedTodoCounter(todos)} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filterName => (
          <a
            key={filterName}
            href="#/"
            className={classNames('filter__link', {
              selected: select === filterName,
            })}
            data-cy={classNames('FilterLink' + filterName)}
            onClick={() => handleClick(filterName)}
          >
            {filterName}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => deleteTodos(completedTodos)}
        disabled={completedTodos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
