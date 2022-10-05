import cn from 'classnames';
import { TodoFilter } from '../../../types/TodoFilter';
import { Todo } from '../../../types/Todo';

type Props = {
  setFilter: (s: string) => void,
  filter: string,
  todos: Todo[],
  removeTodo: (todoId: number) => void,
};

export const Footer: React.FC<Props>
= ({
  setFilter,
  filter,
  todos,
  removeTodo,
}) => {
  const itemsLeft = todos.filter(todo => todo.completed).length;

  const removeCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todos.length - itemsLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link',
            { selected: filter === TodoFilter.All })}
          onClick={() => {
            setFilter(TodoFilter.All);
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link',
            { selected: filter === TodoFilter.Active })}
          onClick={() => {
            setFilter(TodoFilter.Active);
          }}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link',
            { selected: filter === TodoFilter.Completed })}
          onClick={() => {
            setFilter(TodoFilter.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={removeCompletedTodos}
      >
        {itemsLeft > 0 && 'Clear completed'}
      </button>
    </footer>
  );
};
