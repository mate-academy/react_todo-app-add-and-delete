import { Todo } from '../types/Todo';

type FooterTodosProps = {
  todos: Todo[];
  filter: (typeOfSort: 'All' | 'Active' | 'Completed') => void;
  clearCompleted: () => void;
  selected: 'All' | 'Active' | 'Completed';
};

export const FooterTodos: React.FC<FooterTodosProps> = ({
  todos,
  filter,
  clearCompleted,
  selected,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed && todo.id != 0).length} items
        left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={
            selected === 'All' ? 'filter__link selected' : 'filter__link'
          }
          data-cy="FilterLinkAll"
          onClick={() => {
            filter('All');
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            selected === 'Active' ? 'filter__link selected' : 'filter__link'
          }
          data-cy="FilterLinkActive"
          onClick={() => {
            filter('Active');
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            selected === 'Completed' ? 'filter__link selected' : 'filter__link'
          }
          data-cy="FilterLinkCompleted"
          onClick={() => {
            filter('Completed');
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => {
          clearCompleted();
        }}
        disabled={completedTodos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
