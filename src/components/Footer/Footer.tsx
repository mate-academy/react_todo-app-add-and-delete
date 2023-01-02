import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { Navigation } from '../Navigation/Navigation';

type Props = {
  todos: Todo[];
  filterBy: string;
  setFilterBy: (filterBy: Filter) => void;
  onDelete: () => Promise<void>;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterBy,
  setFilterBy,
  onDelete,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);
  const comletedTodos = todos.filter(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <Navigation
        filterBy={filterBy}
        setFilterBy={setFilterBy}
      />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={onDelete}
      >
        {comletedTodos.length ? 'Clear completed' : ''}
      </button>

    </footer>
  );
};

// import classNames from 'classnames';
// import React, { useEffect, useState } from 'react';
// import { Filters } from '../types/Filters';
// import { Todo } from '../types/Todo';

// type Props = {
//   todos: Todo[],
//   visibleTodos: Todo[],
//   setVisibleTodos: (param: Todo[]) => void,
// };

// export const Footer: React.FC<Props> = ({
//   todos, visibleTodos, setVisibleTodos,
// }) => {
//   const [filterType, setFilterType] = useState<Filters>(Filters.all);

//   useEffect(() => {
//     switch (filterType) {
//       case Filters.all:
//         setVisibleTodos(todos);
//         break;

//       case Filters.completed:
//         setVisibleTodos(todos.filter(todo => todo.completed));
//         break;

//       case Filters.active:
//         setVisibleTodos(todos.filter(todo => !todo.completed));
//         break;

//       default:
//         throw new Error('WrongType');
//     }
//   }, [filterType]);

//   return (
//     <footer className="todoapp__footer" data-cy="Footer">
//       <span className="todo-count" data-cy="todosCounter">
//         {`${visibleTodos.length} items left`}
//       </span>

//       <nav className="filter" data-cy="Filter">
//         <a
//           data-cy="FilterLinkAll"
//           href="#/"
//           className={classNames(
//             'filter__link',
//             { selected: filterType === Filters.all },
//           )}
//           onClick={() => setFilterType(Filters.all)}
//         >
//           All
//         </a>

//         <a
//           data-cy="FilterLinkActive"
//           href="#/active"
//           className={classNames(
//             'filter__link',
//             { selected: filterType === Filters.active },
//           )}
//           onClick={() => setFilterType(Filters.active)}
//         >
//           Active
//         </a>
//         <a
//           data-cy="FilterLinkCompleted"
//           href="#/completed"
//           className={classNames(
//             'filter__link',
//             { selected: filterType === Filters.completed },
//           )}
//           onClick={() => setFilterType(Filters.completed)}
//         >
//           Completed
//         </a>
//       </nav>
//       <button
//         data-cy="ClearCompletedButton"
//         type="button"
//         className="todoapp__clear-completed"
//       >
//         Clear completed
//       </button>
//     </footer>
//   );
// };
