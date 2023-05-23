import React from 'react';
import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';
import { TodoFilter } from '../TodoFilter';

type Props = {
  activeTodos: number;
  completedTodo: Todo[];
  handleAllDelete: () => void;
  setFilterBy: React.Dispatch<React.SetStateAction<FilterType>>;
  filterBy: FilterType;
};

export const Footer: React.FC<Props> = ({
  activeTodos,
  completedTodo,
  handleAllDelete,
  setFilterBy,
  filterBy,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos} items left`}
      </span>

      <TodoFilter filter={filterBy} setFilter={setFilterBy} />

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={handleAllDelete}
        style={
          {
            opacity: completedTodo.length === 0
              ? 0
              : 1,
          }
        }
      >
        Clear completed
      </button>
    </footer>
  );
};
