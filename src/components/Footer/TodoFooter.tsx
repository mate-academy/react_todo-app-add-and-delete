/* eslint-disable no-param-reassign */
import { useAppContextContainer } from '../../context/AppContext';
import { footerOption } from './TodoFooter.data';
import TodoFooterOption from './TodoFooterOption';

const TodoFooter = () => {
  const { changeFilterType, filterType, todos, deleteCompleted } =
    useAppContextContainer();

  const completed = todos?.reduce((a, b) => (!b.completed ? (a += 1) : a), 0);
  const isCompleted = todos?.some(el => el.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {completed} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {footerOption.map(option => (
          <TodoFooterOption
            key={option.title}
            option={option}
            filterType={filterType}
            onClick={changeFilterType}
          />
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteCompleted}
        disabled={!isCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default TodoFooter;
