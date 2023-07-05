import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import './Footer.scss';

const filterLinks = [
  { name: 'All', way: '' },
  { name: 'Active', way: 'active' },
  { name: 'Completed', way: 'completed' },
];

interface FooterProps {
  todos: Todo[]
  todosLeftToFinish: Todo[],
  setSelectedFilter: (filterNames: string) => void,
  handleDeleteTodo: (todoId: number) => void
  selectedFilter: string,
}

export const Footer: React.FC<FooterProps> = ({
  todos,
  todosLeftToFinish,
  setSelectedFilter,
  handleDeleteTodo,
  selectedFilter,
}) => {
  const handleSelectedFilter = (todosSelected: string) => {
    setSelectedFilter(todosSelected);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todosLeftToFinish.length} items left`}
      </span>

      <nav className="filter">
        {filterLinks.map(link => (
          <a
            key={link.name}
            href={`#/${link.way}`}
            className={classNames('filter__link', {
              selected: link.name === selectedFilter,
            })}
            onClick={() => handleSelectedFilter(link.name)}
          >
            {link.name}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={todos.length === todosLeftToFinish.length}
        onClick={() => {
          todos
            .filter(todo => todo.completed)
            .map(todo => handleDeleteTodo(todo.id));
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
