import classNames from 'classnames';
import { TodosFilterStatus } from '../../types/Todo';

type Props = {
  remainedTodos: number;
  setFilterTodosStatus: React.Dispatch<React.SetStateAction<TodosFilterStatus>>;
  todosFilterStatus: TodosFilterStatus;
  isSomeTodosCompleted: () => boolean;
  deleteCompletedTodos: () => Promise<void>;
};

export const TodoFooter: React.FC<Props> = ({
  remainedTodos,
  setFilterTodosStatus,
  todosFilterStatus,
  isSomeTodosCompleted,
  deleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {remainedTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          onClick={() => setFilterTodosStatus('All')}
          className={classNames('filter__link', {
            selected: todosFilterStatus === 'All',
          })}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          onClick={() => setFilterTodosStatus('Active')}
          className={classNames('filter__link', {
            selected: todosFilterStatus === 'Active',
          })}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          onClick={() => setFilterTodosStatus('Completed')}
          className={classNames('filter__link', {
            selected: todosFilterStatus === 'Completed',
          })}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteCompletedTodos}
        disabled={!isSomeTodosCompleted()}
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
