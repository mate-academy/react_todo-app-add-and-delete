import { Todo } from '../types/Todo';

enum StatusFilter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

type Props = {
  todos: Todo[],
  countTodos: number,
  selectTodoFilteredList: StatusFilter,
  setSelectTodoFilteredList: (s: StatusFilter) => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  countTodos,
  selectTodoFilteredList,
  setSelectTodoFilteredList,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countTodos} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={selectTodoFilteredList === StatusFilter.ALL
            ? 'filter__link selected'
            : 'filter__link'}
          data-cy="FilterLinkAll"
          onClick={() => {
            setSelectTodoFilteredList(StatusFilter.ALL);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={selectTodoFilteredList === StatusFilter.ACTIVE
            ? 'filter__link selected'
            : 'filter__link'}
          data-cy="FilterLinkActive"
          onClick={() => {
            setSelectTodoFilteredList(StatusFilter.ACTIVE);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={selectTodoFilteredList === StatusFilter.COMPLETED
            ? 'filter__link selected'
            : 'filter__link'}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            setSelectTodoFilteredList(StatusFilter.COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      {
        todos.some((t) => t.completed === true) && (
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
          >
            Clear completed
          </button>
        )
      }
    </footer>
  );
};
