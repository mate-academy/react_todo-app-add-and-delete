import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';
import { TodoFilter } from '../TodoFilter';

type Props = {
  filteredTodos: Todo[],
  filterStatus: Status,
  setFilterStatus: (status: Status) => void;
};

export const Footer: FC<Props> = ({
  filteredTodos,
  setFilterStatus,
  filterStatus,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${filteredTodos.length} items left`}
      </span>

      <TodoFilter
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  )
};
