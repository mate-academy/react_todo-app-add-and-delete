import { Dispatch, SetStateAction, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  setFilterTodo: Dispatch<SetStateAction<Todo[]>>;
  todos: Todo[];
  filterTodo: Todo[];
};

export const FilterFooter: React.FC<Props> = ({ setFilterTodo, todos }) => {
  const showClearCompleted = todos.filter((todo) => todo.completed).length;
  const [selected, setSelected] = useState('all');

  function all() {
    setFilterTodo(todos);
    setSelected('all');
  }

  function active() {
    setFilterTodo(todos.filter((todo) => !todo.completed));
    setSelected('active');
  }

  function completed() {
    setFilterTodo(todos.filter((todo) => todo.completed));
    setSelected('completed');
  }

  const leftItems = todos.filter((todo) => !todo.completed).length;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${leftItems} items left`}</span>
      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selected === 'all',
          })}
          onClick={() => all()}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selected === 'active',
          })}
          onClick={active}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selected === 'completed',
          })}
          onClick={completed}
        >
          Completed
        </a>
      </nav>
      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
      >
        {showClearCompleted > 0 ? 'Clear completed' : null}
      </button>
    </footer>
  );
};
