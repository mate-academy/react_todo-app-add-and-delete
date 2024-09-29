import { useContext } from 'react';
import { FilterContext, InitialTodosContext, TodosContext } from '../store';
import cn from 'classnames';
import { Filter, filteredOptions, Options } from '../types/type';

export const TodoFooter: React.FC = () => {
  const { initialTodos } = useContext(InitialTodosContext);
  const { dispatch } = useContext(TodosContext);
  const { filter, setFilter } = useContext(FilterContext);

  const hasCompletedTodos = initialTodos.some(todo => todo.completed);
  const numberOfItems = initialTodos.filter(todo => !todo.completed).length;

  const AllTodos = () => {
    setFilter(Filter.All);
    dispatch({ type: Filter.All.toUpperCase(), payload: initialTodos });
  };

  const activeTodos = () => {
    setFilter(Filter.Active);

    dispatch({ type: Filter.Active.toUpperCase(), payload: initialTodos });
  };

  const competedTodos = () => {
    setFilter(Filter.Completed);

    dispatch({ type: Filter.Completed.toUpperCase(), payload: initialTodos });
  };

  const arrOfFilteredFunc = [AllTodos, activeTodos, competedTodos];

  if (!initialTodos.length) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${numberOfItems} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filteredOptions.map((el: Options, index: number) => (
          <a
            key={el.title}
            href={el.href}
            className={cn('filter__link', { selected: filter === el.title })}
            data-cy={el['data-cy']}
            role="button"
            onClick={arrOfFilteredFunc[index]}
          >
            {el.title}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
