import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  handleDelete: (todoId: number) => void;
  setFilterOption: (arg: string) => void;
  filterOption: string,
  todos: Todo[],
};

export const Footer: React.FC<Props> = ({
  todos,
  filterOption,
  setFilterOption,
  handleDelete,
}) => {
  const deleteCompleted = () => {
    todos.filter(todo => todo.completed)
      .forEach(todo => handleDelete(todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterOption === 'all' },
          )}
          onClick={() => setFilterOption('all')}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterOption === 'active' },
          )}
          onClick={() => setFilterOption('active')}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterOption === 'completed' },
          )}
          onClick={() => setFilterOption('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
