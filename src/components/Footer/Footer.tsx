import classNames from 'classnames';
import { FilterTodos } from '../../enum/FilterTodos';
import { Todo } from '../../types/Todo';

type Props = {
  setChooseFilter: (value: string) => void,
  todos: Todo[],
  chooseFilter: string,
  deletePerformedTask: () => void,
};

export const Footer: React.FC<Props> = ({
  setChooseFilter,
  todos,
  chooseFilter,
  deletePerformedTask,
}) => {
  const activeButton = () => {
    return todos.find(todo => todo.completed);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.length}
        {' '}
        items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: chooseFilter === FilterTodos.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setChooseFilter(FilterTodos.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: chooseFilter === FilterTodos.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setChooseFilter(FilterTodos.Active)}

        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: chooseFilter === FilterTodos.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setChooseFilter(FilterTodos.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deletePerformedTask}
      >
        {activeButton() && ('Clear completed')}
      </button>
    </footer>
  );
};
