/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, RefObject } from 'react';
// import cn from 'classnames';

type Props = {
  newTodoField: RefObject<HTMLInputElement>
};

export const Footer: FC<Props> = () => (
  <h1>test</h1>
  // <footer className="todoapp__footer" data-cy="Footer">
  //   <span className="todo-count" data-cy="todosCounter">
  //     {`${activeTodos.length} items left`}
  //   </span>

  //   <nav className="filter" data-cy="Filter">
  //     <a
  //       data-cy="FilterLinkAll"
  //       href="#/"
  //       className={cn(
  //         'filter__link',
  //         {
  //           selected: filterBy === TodosFilter.None,
  //         },
  //       )}
  //       onClick={() => handleFilterChange(TodosFilter.None)}
  //     >
  //       All
  //     </a>

  //     <a
  //       data-cy="FilterLinkActive"
  //       href="#/active"
  //       className={cn(
  //         'filter__link',
  //         {
  //           selected: filterBy === TodosFilter.Active,
  //         },
  //       )}
  //       onClick={() => handleFilterChange(TodosFilter.Active)}
  //     >
  //       Active
  //     </a>
  //     <a
  //       data-cy="FilterLinkCompleted"
  //       href="#/completed"
  //       className={cn(
  //         'filter__link',
  //         {
  //           selected: filterBy === TodosFilter.Completed,
  //         },
  //       )}
  //       onClick={() => handleFilterChange(TodosFilter.Completed)}
  //     >
  //       Completed
  //     </a>
  //   </nav>

  //   <button
  //     data-cy="ClearCompletedButton"
  //     type="button"
  //     className="todoapp__clear-completed"
  //   >
  //     Clear completed
  //   </button>
  // </footer>
);
