import cn from 'classnames';
import { TodoSelector } from '../../types/TodoSelector';

type Props = {
  hasCompletedTodos: boolean;
  leftTodosCount: number;
  todoSelector: string | null;
  onChangeTodoSelector: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  onClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  hasCompletedTodos,
  leftTodosCount,
  todoSelector,
  onChangeTodoSelector,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${leftTodosCount} items left`}</span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: todoSelector === TodoSelector.ALL,
          })}
          onClick={onChangeTodoSelector}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: todoSelector === TodoSelector.ACTIVE,
          })}
          onClick={onChangeTodoSelector}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: todoSelector === TodoSelector.COMPLETED,
          })}
          onClick={onChangeTodoSelector}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        style={{ visibility: hasCompletedTodos ? 'visible' : 'hidden' }}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
