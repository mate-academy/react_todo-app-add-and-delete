import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterTypes } from '../../types/FilterTypes';

const filterLinks = [
  { name: FilterTypes.ALL, way: '' },
  { name: FilterTypes.ACTIVE, way: 'active' },
  { name: FilterTypes.COMPLETED, way: 'completed' },
];

interface FooterProps {
  todos: Todo[]
  todosLeftToFinish: Todo[],
  setSelectedFilter: (filterNames: FilterTypes) => void,
  handleDeleteTodo: (todoId: number) => void
  selectedFilter: FilterTypes,
}

export const Footer: React.FC<FooterProps> = ({
  todos,
  todosLeftToFinish,
  setSelectedFilter,
  handleDeleteTodo,
  selectedFilter,
}) => {
  const handleSelectedFilter = (todosSelected: FilterTypes) => {
    setSelectedFilter(todosSelected);
  };

  const handleMultipleDelete = () => {
    todos
      .filter(todo => todo.completed)
      .map(todo => handleDeleteTodo(todo.id));
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
        onClick={handleMultipleDelete}
      >
        Clear completed
      </button>
    </footer>
  );
};
