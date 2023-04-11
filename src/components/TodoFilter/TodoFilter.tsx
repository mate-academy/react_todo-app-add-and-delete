import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[] | null;
  setFilteredTodos: (todos: Todo[] | null) => void;
}

export const TodoFilter: React.FC<Props> = ({ todos, setFilteredTodos }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredTodos = todos && todos.filter((todo) => {
    switch (activeFilter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  useEffect(() => {
    setFilteredTodos(filteredTodos);
  });

  return (
    <nav className="filter">
      <a
        href="#/"
        className="filter__link all"
        onClick={() => setActiveFilter('all')}
      >
        All
      </a>

      <a
        href="#/active"
        className="filter__link active"
        onClick={() => setActiveFilter('active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className="filter__link completed"
        onClick={() => setActiveFilter('completed')}
      >
        Completed
      </a>
    </nav>
  );
};
