import React from 'react';
import { TodoNav } from '../TodoNav';
import { FilterBy } from '../../types/FilterBy';

type Props = {
  todos: number;
  filterBy: FilterBy;
  handleFilter: (filter: FilterBy) => void;
  removeAllCompletedTodos: () => Promise<void>;
  completedTodos: number;
};

export const TodoFooter: React.FC<Props>
  = React.memo(({
    todos, filterBy, handleFilter, removeAllCompletedTodos,
    completedTodos,
  }) => {
    const itemsLeft = todos - completedTodos;

    return (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="todosCounter">
          {`${itemsLeft} items left`}
        </span>
        <TodoNav filterBy={filterBy} handleFilter={handleFilter} />
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={removeAllCompletedTodos}
        >
          Clear completed
        </button>
      </footer>
    );
  });
