import React from 'react';
import { TodoCount } from './todoCount';
import { Todo } from '../types/Todo';
import { FilterOption } from '../types/filterOption';

interface Props {
  handleSetFilter: (newFilter: FilterOption) => void;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
}

// eslint-disable-next-line max-len
export const Footer: React.FC<Props> = ({ handleSetFilter, todos, setTodos }) => {
  const handleRemoveComplited = () => {
    setTodos(todos.filter((todo) => todo.completed !== true));
  };

  return (
    <footer className="todoapp__footer">
      <TodoCount todos={todos} />
      <nav className="filter">
        <a
          href="#/"
          className="filter__link selected"
          onClick={() => handleSetFilter('All')}
        >
          All
        </a>

        <a
          href="#/active"
          className="filter__link"
          onClick={() => handleSetFilter('Active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className="filter__link"
          onClick={() => handleSetFilter('Completed')}
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={handleRemoveComplited}
      >
        Clear completed
      </button>
    </footer>
  );
};
