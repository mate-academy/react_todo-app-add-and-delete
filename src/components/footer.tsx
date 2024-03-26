import cn from 'classnames';
import { Status, Todo } from '../types/Todo';
import { handleDeleteTodo } from '../api/todos';

type Props = {
  selectedFilter: string;
  onSelect: (a: string) => void;
  count: number;
  todos: Todo[];
  setIsLoading: (e: number | null) => void;
  setErrorMessage: (m: string) => void;
};

export const Footer: React.FC<Props> = ({
  selectedFilter,
  onSelect,
  count,
  todos,
  setIsLoading,
  setErrorMessage,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);

  const handleDeleteCompletedTodos = () => {
    completedTodos.forEach(todo => {
      handleDeleteTodo(todo, todo.id, setIsLoading, setErrorMessage);
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${count} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: selectedFilter === Status.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onSelect(Status.all)}
        >
          {Status.all}
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: selectedFilter === Status.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onSelect(Status.active)}
        >
          {Status.active}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedFilter === Status.complited,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onSelect(Status.complited)}
        >
          {Status.complited}
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos.length}
        onClick={() => {
          handleDeleteCompletedTodos();
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
