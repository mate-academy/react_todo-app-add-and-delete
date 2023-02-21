import cn from 'classnames';

type Props = {
  leftTodosCount: number;
  todoSelector: string | null;
  onChangeTodoSelector: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

export const TodoFooter: React.FC<Props> = ({
  leftTodosCount,
  todoSelector,
  onChangeTodoSelector,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${leftTodosCount} items left`}</span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: todoSelector === 'All' })}
          onClick={onChangeTodoSelector}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: todoSelector === 'Active',
          })}
          onClick={onChangeTodoSelector}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: todoSelector === 'Completed',
          })}
          onClick={onChangeTodoSelector}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button type="button" className="todoapp__clear-completed">
        Clear completed
      </button>
    </footer>
  );
};
