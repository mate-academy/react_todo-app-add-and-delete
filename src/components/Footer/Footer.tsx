import { useTodo } from '../../provider/todoProvider';
import { FilterType } from '../../types/FilterType';

import { TodoCount } from '../TodoCount';

export const Footer = () => {
  const { handleSetFilterTodos, deleteCompleted, todos } = useTodo();

  const addFilterType = (filterType: FilterType) => {
    handleSetFilterTodos(filterType);
  };

  const completedTodos = todos.filter(task => task.completed);

  return (
    <footer className="todoapp__footer">
      <TodoCount />
      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className="filter__link selected"
          onClick={() => addFilterType('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className="filter__link"
          onClick={() => addFilterType('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className="filter__link"
          onClick={() => addFilterType('completed')}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={() => deleteCompleted(completedTodos)}
      >
        Clear completed
      </button>
    </footer>
  );
};
