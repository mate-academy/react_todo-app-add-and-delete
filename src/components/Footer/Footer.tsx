import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { SelectFilterValue } from '../../types/SelectFilterValue';

type Props = {
  todos: Todo[];
  count: number;
  selectValue: string;
  setSelectValue: (value: SelectFilterValue) => void;
  deleteComlpetedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  count,
  selectValue,
  setSelectValue,
  deleteComlpetedTodos,
}) => {
  return (
    <footer
      data-cy="Footer"
      className={classNames('todoapp__footer', {
        hidden: todos.length !== 0,
      })}
    >
      <span className="todo-count" data-cy="TodosCounter">
        {count} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectValue === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => {
            setSelectValue(SelectFilterValue.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectValue === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => {
            setSelectValue(SelectFilterValue.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectValue === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            setSelectValue(SelectFilterValue.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={() => {
          deleteComlpetedTodos();
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
