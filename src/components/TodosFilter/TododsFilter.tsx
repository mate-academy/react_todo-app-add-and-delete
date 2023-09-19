/*eslint-disable*/

import classNames from "classnames";
import React, { useContext } from "react";
import { TodosContext } from "../../context/TodosContext";
import { SORT } from "../../types/SortEnum";

export const TodosFilter: React.FC = () => {
  const { sortField, updateSortField } = useContext(TodosContext);

  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames({
          filter__link: true,
          selected: sortField === SORT.ALL,
        })}
        onClick={() => updateSortField(SORT.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames({
          filter__link: true,
          selected: sortField === SORT.ACTIVE,
        })}
        onClick={() => updateSortField(SORT.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames({
          filter__link: true,
          selected: sortField === SORT.COMPLETED,
        })}
        onClick={() => updateSortField(SORT.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
};
