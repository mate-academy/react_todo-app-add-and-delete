import classNames from 'classnames';
import { Status } from '../../utils/TodoFilter';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  selectedFilter: Status;
  setSelectedFilter: (state: Status) => void;
  activeTodosCount: number;
  completedTodosCount: number;
  handleDeleteTodo: (todoId: number) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  selectedFilter,
  setSelectedFilter,
  activeTodosCount,
  completedTodosCount,
  handleDeleteTodo,
}) => {
  const handleCompletedTodosDelete = () => {
    const completedTodoId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedTodoId.forEach(todo => {
      handleDeleteTodo(todo);
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(status => (
          <a
            key={status}
            href="#/"
            className={classNames('filter__link', {
              selected: selectedFilter === status,
            })}
            data-cy={`FilterLink${status}`}
            onClick={() => setSelectedFilter(status)}
          >
            {status}
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
