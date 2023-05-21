import { FC } from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/FilterConditions';
import { Todo } from '../../types/Todo';
import { FilterComponent } from '../Filter';

interface Props {
  todos: Todo[];
  filterCondition: Filter;
  onChangeFilter: React.Dispatch<React.SetStateAction<Filter>>;
  handleClearCompleted: () => void;
}

export const Footer: FC<Props> = ({
  todos,
  filterCondition,
  onChangeFilter,
  handleClearCompleted,
}) => {
  const filterNames = Object.values(Filter);
  const activeTodos = todos.filter(todo => !todo.completed);
  const shouldClearCompletedBe = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {activeTodos.length === 1 ? '1 item left' : `${activeTodos.length} items left`}
      </span>

      <FilterComponent
        filterCondition={filterCondition}
        filterNames={filterNames}
        onChangeFilter={onChangeFilter}
      />

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          'notification hidden': !shouldClearCompletedBe,
        })}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>

    </footer>
  );
};
