import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { TodoStatus } from '../types/TodoStatus';

type TodoFooterProps = {
  todos: Todo[];
  setVisibleTodos: (filteredList: Todo[]) => void;
  setSelectedFilterStatus: React.Dispatch<React.SetStateAction<TodoStatus>>;
  selectedFilterStatus: TodoStatus;
  removeTodo: (todo: Todo) => void;
};

export const TodoFooter: React.FC<TodoFooterProps> = ({
  todos,
  selectedFilterStatus,
  setSelectedFilterStatus,
  removeTodo,
}) => {
  const notCompletedTodos = todos.filter(todo => todo.completed === false);
  const completedTodos = todos.filter(todo => todo.completed === true);
  const filterTypes = Object.values(TodoStatus);

  return (
    /* Hide the footer if there are no todos */
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${notCompletedTodos.length} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filterTypes.map((filterType, index) => (
          <a
            href="#/"
            key={index}
            className={classNames('filter__link', {
              selected: selectedFilterStatus === filterType,
            })}
            data-cy={`FilterLink${filterType}`}
            onClick={() => {
              setSelectedFilterStatus(filterType);
            }}
          >
            {filterType}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
        onClick={() => {
          completedTodos.map(todo => removeTodo(todo));
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
