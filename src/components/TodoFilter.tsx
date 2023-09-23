import React from 'react';
// import { TContext, useTodoContext } from './TodoContext';
import { SortTypes } from '../types/Todo';

type Props = {
  handleSort: (type:string) => void;
  sortType: SortTypes;
};

const types = ['All', 'Active', 'Completed'];

export const TodoFilter: React.FC<Props> = ({ handleSort, sortType }) => {
  // const {
  //   sortType,
  //   // setSortType,
  // } = useTodoContext() as TContext;

  return (
    <nav className="filter" data-cy="Filter">
      {types.map((type:string) => (
        <a
          href="#/"
          className={`filter__link ${type.toLowerCase() === sortType ? 'selected' : ''}`}
          data-cy={`FilterLink${type}`}
          key={type}
          onClick={() => handleSort(type.toLowerCase())}
        >
          {type}
        </a>
      ))}
    </nav>
    // <nav className="filter" data-cy="Filter">
    //   <a
    //     href="#/"
    //     className="filter__link selected"
    //     data-cy="FilterLinkAll"
    //     onClick={() => handleSort()}
    //   >
    //     All
    //   </a>

  //   <a
  //     href="#/active"
  //     className="filter__link"
  //     data-cy="FilterLinkActive"
  //   >
  //     Active
  //   </a>

  //   <a
  //     href="#/completed"
  //     className="filter__link"
  //     data-cy="FilterLinkCompleted"
  //   >
  //     Completed
  //   </a>
  // </nav>
  );
};
