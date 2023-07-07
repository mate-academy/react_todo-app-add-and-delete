import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FooterProps {
  setFilter: (arg0:Filter) => void,
  filter: Filter,
  todos:Todo[],
  removeAllCompleted:()=>void,
}

export const Footer: React.FC<FooterProps> = ({
  setFilter, filter, todos, removeAllCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todos.filter(todo => todo.completed).length} item${todos.length > 1 ? 's' : ''} left`}
      </span>
      <nav className="filter">
        <a
          href="#/"
          className={`filter__link ${filter === Filter.all ? 'selected' : ''}`}
          onClick={() => setFilter(Filter.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === Filter.active ? 'selected' : ''}`}
          onClick={() => setFilter(Filter.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter === Filter.completed ? 'selected' : ''}`}
          onClick={() => setFilter(Filter.completed)}
        >
          Completed
        </a>
      </nav>
      {todos.some(todo => todo.completed)
       && (
         <button
           type="button"
           className="todoapp__clear-completed"
           onClick={removeAllCompleted}
         >
           Clear completed
         </button>
       )}
    </footer>
  );
};
