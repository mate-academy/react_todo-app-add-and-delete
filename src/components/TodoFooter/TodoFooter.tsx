import classNames from 'classnames';
// eslint-disable-next-line max-len, prettier/prettier
import { TodoCompletedCategory as CompletedCategory } from '../../types/TodoCompletedCategory';

type Props = {
  countOfNotCompletedTodos: number;
  isSomeTodoComplated: boolean;
  completedCategory: CompletedCategory;
  onCompletedCategory: (completedCategory: CompletedCategory) => void;
  deleteAllCompletedTodos: () => void;
};

const activityFilters = {
  [CompletedCategory.active]: 'Active',
  [CompletedCategory.completed]: 'Completed',
  [CompletedCategory.all]: 'All',
};

export const TodoFooter: React.FC<Props> = ({
  countOfNotCompletedTodos,
  isSomeTodoComplated,
  completedCategory,
  onCompletedCategory,
  deleteAllCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countOfNotCompletedTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(CompletedCategory).map(category => (
          <a
            key={category}
            href={`#/${category}`}
            className={classNames('filter__link', {
              selected: completedCategory === category,
            })}
            data-cy={`FilterLink${activityFilters[category]}`}
            onClick={() => onCompletedCategory(category)}
          >
            {activityFilters[category]}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isSomeTodoComplated}
        onClick={() => deleteAllCompletedTodos()}
      >
        Clear completed
      </button>
    </footer>
  );
};
