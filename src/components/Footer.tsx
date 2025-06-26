import React from 'react';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';

import { Filter } from './Filter';

type Props = {
  activeTodos: Todo[];
  filterStatus: Status;
  setFilterStatus: (filterStatus: Status) => void;
  completedTodos: Todo[];
  handleDeleteCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodos,
  filterStatus,
  setFilterStatus,
  completedTodos,
  handleDeleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <Filter filterStatus={filterStatus} setFilterStatus={setFilterStatus} />

      <button
        disabled={completedTodos.length === 0}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
