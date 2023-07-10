/* eslint-disable react/jsx-one-expression-per-line */
import classNames from 'classnames';
import { useTodoContext } from '../hooks/useTodoContext';
import { TodoStatus } from '../types/Todo';

const TodoFooter = () => {
  const {
    selectedStatus,
    todosContainer,
    completedTodos,
    filterByStatus,
    onDeleteCompleted,
  } = useTodoContext();

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {todosContainer.length - completedTodos.length} items left
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectedStatus === TodoStatus.All,
          })}
          onClick={() => filterByStatus(TodoStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectedStatus === TodoStatus.Active,
          })}
          onClick={() => filterByStatus(TodoStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectedStatus === TodoStatus.Completed,
          })}
          onClick={() => filterByStatus(TodoStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={completedTodos.length === 0}
        onClick={onDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default TodoFooter;
