import { useContext } from 'react';
import { TodosContext } from '../TodosContext';
import { ActionState } from '../helpers/helpers';
import { Todo } from '../types/Todo';
import { actions } from '../helpers/reducer';

export const Footer = () => {
  const {
    todos,
    filterTodos,
    setFilterTodos,
    dispatch,
  } = useContext(TodosContext);

  function countItems() {
    const totalAmount = todos.filter((todo: Todo) => !todo.completed);

    return totalAmount.length;
  }

  const handleClearCompleted = () => {
    dispatch(actions.clearCompleted);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countItems()} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={filterTodos === ActionState.ALL
            ? 'filter__link selected'
            : 'filter__link'}
          data-cy="FilterLinkAll"
          onClick={() => setFilterTodos(ActionState.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={filterTodos === ActionState.ACTIVE
            ? 'filter__link selected'
            : 'filter__link'}
          data-cy="FilterLinkActive"
          onClick={() => setFilterTodos(ActionState.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={filterTodos === ActionState.COMPLETED
            ? 'filter__link selected'
            : 'filter__link'}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterTodos(ActionState.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {/* ХЕНДЛЕР НЕ ПРАЦЮЄ, СПИТАТИСЯ ЧОМУ */}
      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onChange={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
