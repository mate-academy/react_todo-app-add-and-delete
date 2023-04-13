import classNames from 'classnames';
import { FC } from 'react';
import { FilterType } from '../../types/FilterType';
import { Todo } from '../TodoItem/Todo';

interface Props {
  todos: Todo[],
  activeTodos: number,
  filterType: FilterType,
  onChangeFilterType: (filterType: FilterType) => void,
  onRemoveCompleted: () => void,
}

export const Footer: FC<Props> = (props) => {
  const {
    todos,
    filterType,
    activeTodos,
    onChangeFilterType,
    onRemoveCompleted,
  } = props;

  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter">
        {Object.values(FilterType).map(value => (
          <a
            href={`#/${value}`}
            key={value}
            className={classNames('filter__link', {
              selected: value === filterType,
            })}
            onClick={() => onChangeFilterType(value)}
          >
            {value}
          </a>
        ))}
      </nav>

      {completedTodos.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onRemoveCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
