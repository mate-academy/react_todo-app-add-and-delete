import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  errorMessage: string | null;
  todos: Todo[];
  todoCount: number;
  setFilterBy: React.Dispatch<React.SetStateAction<Filter>>;
  filterBy: string;
  handleClearCompleted: () => void;
  completedTasks: Todo[];
};

export const Footer: React.FC<Props> = ({
  todos,
  todoCount,
  filterBy,
  setFilterBy,
  handleClearCompleted,
  completedTasks,
}) => {
  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {`${todoCount} items left`}
          </span>

          {/* Active link should have the 'selected' class */}
          <nav className="filter" data-cy="Filter">
            {Object.values(Filter).map(item => (
              <a
                key={item}
                href={`#/${item}`}
                className={classNames('filter__link', {
                  selected: filterBy === item,
                })}
                data-cy={`FilterLink${item}`}
                onClick={() => setFilterBy(item)}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* this button should be disabled if there are no completed todos */}
          <button
            type="button"
            className="todoapp__clear-completed"
            disabled={completedTasks.length === 0}
            data-cy="ClearCompletedButton"
            onClick={() => {
              handleClearCompleted();
            }}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
