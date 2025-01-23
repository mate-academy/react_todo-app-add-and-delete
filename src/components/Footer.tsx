import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';
import cn from 'classnames';

interface FooterProps {
  todos: Todo[];
  todosType: Filter;
  handleTodosTypeChange: (todosType: Filter) => void;
  handleDeleteTodo: (todoId: number) => Promise<void>;
}

export const Footer: React.FC<FooterProps> = ({
  todos,
  todosType = Filter.All,
  handleTodosTypeChange,
  handleDeleteTodo,
}) => {
  const active = todos.filter(todo => !todo.completed).length;
  const completed = todos.filter(todo => todo.completed);

  const handleDeleteButton = () => {
    completed.map(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  return (
    todos.length > 0 && (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {active} items left
        </span>

        <nav className="filter" data-cy="Filter">
          {Object.values(Filter).map(filter => (
            <a
              key={filter}
              href="#/"
              className={cn('filter__link', {
                selected: todosType === filter,
              })}
              data-cy={`FilterLink${filter}`}
              onClick={() => handleTodosTypeChange(filter)}
            >
              {filter}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={completed.length === 0}
          onClick={handleDeleteButton}
        >
          Clear completed
        </button>
      </footer>
    )
  );
};
