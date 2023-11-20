import { useEffect, useState } from 'react';
import { getTodosByStatus } from '../../api/todos';
import { Errors } from '../../types/Errors';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';
import { TodosFilter } from '../TodosFilter';
import { USER_ID } from '../../utils/userId';

type Props = {
  filterStatus: Status,
  setFilterStatus: React.Dispatch<React.SetStateAction<Status>>,
  setError: React.Dispatch<React.SetStateAction<Errors | null>>
};

export const Footer: React.FC<Props> = ({
  filterStatus,
  setFilterStatus,
  setError,
}) => {
  const [completed, setCompleted] = useState<Todo[]>([]);
  const [active, setActive] = useState<Todo[]>([]);

  useEffect(() => {
    getTodosByStatus(USER_ID, false)
      .then(setActive)
      .catch(() => setError(Errors.LoadError));

    getTodosByStatus(USER_ID, true)
      .then(setCompleted)
      .catch(() => setError(Errors.LoadError));
  }, [setError]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {active.length}
        {' '}
        items left
      </span>

      <TodosFilter
        setFilterStatus={setFilterStatus}
        filterStatus={filterStatus}
        setError={setError}
      />

      {completed.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
