import { FC } from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/FilterConditions';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/Error';
import { removeTodo } from '../../api/todos';

interface Props {
  allTodos: Todo[];
  filterCondition: Filter;
  onChangeFilter: React.Dispatch<React.SetStateAction<Filter>>;
  onChangeError: React.Dispatch<React.SetStateAction<ErrorType>>;
  onChangeTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onChangeProcessing: React.Dispatch<React.SetStateAction<number[]>>;
}

export const Footer: FC<Props> = ({
  allTodos,
  filterCondition,
  onChangeFilter,
  onChangeError,
  onChangeTodos,
  onChangeProcessing,
}) => {
  const handleFilterClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onChangeFilter(event.currentTarget.textContent as Filter);
  };

  const filterNames = Object.values(Filter);
  const activeTodos = allTodos.filter(todo => !todo.completed);

  const handleClearCompletedClick = () => {
    allTodos.forEach(async todo => {
      if (!todo.completed) {
        return;
      }

      try {
        onChangeProcessing(prev => [...prev, todo.id]);
        await removeTodo(todo.id);
        onChangeTodos(prev => prev.filter(({ id }) => id !== todo.id));
      } catch {
        onChangeError(ErrorType.Delete);
      } finally {
        onChangeProcessing(prev => prev.filter(id => id !== todo.id));
      }
    });
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {activeTodos.length === 1 ? '1 item left' : `${activeTodos.length} items left`}
      </span>

      <nav className="filter">
        {filterNames.map(filterName => (
          <a
            key={filterName}
            href={filterName === Filter.All ? '#/' : `#/${filterName}`}
            onClick={handleFilterClick}
            className={classNames('filter__link', {
              selected: filterCondition === filterName,
            })}
          >
            {filterName}
          </a>
        ))}
      </nav>

      {allTodos.some(todo => todo.completed) && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={handleClearCompletedClick}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
