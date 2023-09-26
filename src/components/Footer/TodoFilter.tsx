import { Dispatch, SetStateAction, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TypeTodos } from '../../types/type';

type Props = {
  todos: Todo[],
  setTypeTodos: Dispatch<SetStateAction<TypeTodos>>,
  deleteCompletedTodos: () => void,
};

export const TodoFilter: React.FC<Props> = ({
  todos,
  setTypeTodos,
  deleteCompletedTodos,
}) => {
  const [filter, setFilter] = useState<TypeTodos>(TypeTodos.All);
  const activeCount = todos.filter(todo => !todo.completed).length;
  const countCompleted = todos.length - activeCount;

  const handlerFilter = (filterTodo: TypeTodos) => {
    setTypeTodos(filterTodo);
    setFilter(filterTodo);
  };

  return todos.length > 0 ? (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeCount} item${activeCount !== 1 ? 's' : ''} left`}
      </span>
      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: filter === TypeTodos.All })}
          onClick={() => handlerFilter(TypeTodos.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link',
            { selected: filter === TypeTodos.Active })}
          onClick={() => handlerFilter(TypeTodos.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            { selected: filter === TypeTodos.Completed })}
          onClick={() => handlerFilter(TypeTodos.Completed)}
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteCompletedTodos}
        style={{ visibility: countCompleted > 0 ? 'visible' : 'hidden' }}
      >
        Clear completed
      </button>
    </footer>
  ) : null;
};

export default TodoFilter;
