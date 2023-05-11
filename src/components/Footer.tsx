import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Select } from '../types/Select';

type Props = {
  countItemLeft: number | undefined;
  selectedFilter: Select
  setSelectedFilter: (selectedFilter: Select) => void;
  todoList: Todo [] | null;
  deleteClickHandlerFooter: (todoListHandler: Todo[] | null) => void
};

export const Footer: React.FC<Props> = ({
  countItemLeft,
  selectedFilter,
  setSelectedFilter,
  todoList,
  deleteClickHandlerFooter,
}) => {
  const { ALL, ACTIVE, COMPLETED } = Select;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${countItemLeft} items left`}
      </span>
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: selectedFilter === ALL },
          )}
          onClick={() => {
            setSelectedFilter(ALL);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: selectedFilter === ACTIVE },
          )}
          onClick={() => {
            setSelectedFilter(ACTIVE);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: selectedFilter === COMPLETED },
          )}
          onClick={() => {
            setSelectedFilter(COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        onClick={() => {
          deleteClickHandlerFooter(todoList);
        }}
        className={classNames(
          'todoapp__clear-completed',
          {
            'is-invisible': (!todoList?.find(todo => todo.completed)),
          },
        )}
      >
        Clear completed
      </button>

    </footer>
  );
};
