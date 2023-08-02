import { Status } from '../../types/Status';
import { TodoFilter } from '../TodoFilter/TodoFilter';

type Props = {
  numberOfCompletedTodos: number,
  numberOfNotCompletedTodos: number,
  sortField: Status,
  setSortField: (status: Status) => void,
  clearCompleted: (todoId: number)=> void,
};

export const Footer: React.FC<Props> = ({
  numberOfCompletedTodos,
  numberOfNotCompletedTodos,
  sortField,
  setSortField,
  clearCompleted,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${numberOfNotCompletedTodos} items left`}
    </span>

    <TodoFilter
      sortField={sortField}
      setSortField={setSortField}
    />

    {numberOfCompletedTodos > 0
      && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => clearCompleted}
        >
          Clear completed
        </button>
      )}
  </footer>
);
