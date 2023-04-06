import { Filter } from './Filter';
import { Sort } from '../types/Sort';
import { Todo } from '../types/Todo';

type Props = {
  setSort: (arg: Sort) => void,
  sort: Sort,
  todos: Todo[],
  handleRemoveCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  setSort, sort, todos, handleRemoveCompletedTodos,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {activeTodos.length}
        {' '}
        items left
      </span>

      <Filter setSort={setSort} sort={sort} />

      {completedTodos.length > 0
        && (
          <button
            type="button"
            className="todoapp__clear-completed"
            onClick={handleRemoveCompletedTodos}
          >
            Clear completed
          </button>
        )}
    </footer>
  );
};
