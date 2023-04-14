import classNames from 'classnames';
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

      <button
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { todoapp__hidden: !completedTodos.length },
        )}
        onClick={handleRemoveCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
