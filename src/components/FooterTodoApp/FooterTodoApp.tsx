import classNames from 'classnames';
import React, { FC } from 'react';
import { Category } from '../../types/Category';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

/* Hide the footer if there are no todos */

interface Props {
  todos: Todo[];
  category: Category;
  setCategory: (category: Category) => void;
}

export const FooterTodoApp: FC<Props> = React.memo(({
  todos,
  category,
  setCategory,
}) => {
  const leftItems = todos.filter(({ completed }) => completed === false).length;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${leftItems} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: category === 'all',
          })}
          onClick={() => setCategory('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: category === 'active',
          })}
          onClick={() => setCategory('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: category === 'completed',
          })}
          onClick={() => setCategory('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          notification: todos.length - leftItems <= 0,
          hidden: todos.length - leftItems <= 0,
        })}
        onClick={() => {
          todos
            .filter(({ completed }) => completed === true)
            .map(({ id }) => deleteTodo(id));
        }}
      >
        Clear completed
      </button>
    </footer>
  );
});
