import { TodosArrayType } from '../types/Todo';

type Props = {
  todos: TodosArrayType;
  completeFilter: null | boolean;
  setCompleteFilter: (newCompleteFilter: null | boolean) => void;
  deleteCompletedTodos: () => void;
};

export default function TodosFooter({
  todos,
  completeFilter,
  setCompleteFilter,
  deleteCompletedTodos,
}: Props) {
  function handleButton() {
    deleteCompletedTodos();
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.reduce(
          (count, todo) => (!todo.completed ? count + 1 : count),
          0,
        )}{' '}
        items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={
            'filter__link ' + (completeFilter === null ? 'selected' : '')
          }
          data-cy="FilterLinkAll"
          onClick={() => {
            setCompleteFilter(null);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            'filter__link ' + (completeFilter === true ? 'selected' : '')
          }
          data-cy="FilterLinkActive"
          onClick={() => {
            setCompleteFilter(true);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            'filter__link ' + (completeFilter === false ? 'selected' : '')
          }
          data-cy="FilterLinkCompleted"
          onClick={() => {
            setCompleteFilter(false);
          }}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        disabled={todos.every(({ completed }) => !completed)}
        type="button"
        className={
          'todoapp__clear-completed' +
          (completeFilter === false ? ' selected' : '')
        }
        data-cy="ClearCompletedButton"
        onClick={handleButton}
      >
        Clear completed
      </button>
    </footer>
  );
}
