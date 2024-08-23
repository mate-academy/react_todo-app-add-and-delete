import classNames from 'classnames';
import { FilterState } from '../../types/FilterState';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  activeTodosCount: number;
  completedTodosCount: number;
  activeFilter: FilterState;
  setActiveFilter: (state: FilterState) => void;
  handleDeleteTodo: (todoId: number) => void;
};

export const Footer = ({
  todos,
  activeTodosCount,
  completedTodosCount,
  activeFilter,
  setActiveFilter,
  handleDeleteTodo,
}: Props) => {
  const states = Object.values(FilterState);

  const handleCompletedTodosDelete = () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedTodoIds.forEach(todo => {
      handleDeleteTodo(todo);
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {states.map(state => (
          <a
            href={state === FilterState.ALL ? `#/` : `#/${state}`}
            key={state}
            className={classNames('filter__link', {
              selected: activeFilter === state,
            })}
            data-cy={`FilterLink${state}`}
            onClick={() => setActiveFilter(state)}
          >
            {state}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
        onClick={handleCompletedTodosDelete}
      >
        Clear completed
      </button>
    </footer>
  );
};
