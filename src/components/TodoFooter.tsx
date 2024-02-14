import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import { TodosFilter } from './TodosFilter';

type Props = {
  unCompletedTodos: number,
  filter: Status,
  setFilter: React.Dispatch<React.SetStateAction<Status>>
  todos: Todo[],
  removeCompletedTodos: () => void
};

export const TodoFooter:React.FC<Props> = ({
  unCompletedTodos,
  filter,
  setFilter,
  todos,
  removeCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${unCompletedTodos} items left`}
      </span>
      <TodosFilter filter={filter} setFilter={setFilter} />
      <button
        type="button"
        className="todoapp__clear-completed "
        data-cy="ClearCompletedButton"
        onClick={removeCompletedTodos}
        disabled={unCompletedTodos === todos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
