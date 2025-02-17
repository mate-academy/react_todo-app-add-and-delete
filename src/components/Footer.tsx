import React from 'react';
import { FilterTodos } from './FilterTodos';
import { useTodosContext } from '../context/TodoContext';

interface Props {
  itemsLeft: number;
}

export const Footer: React.FC<Props> = ({ itemsLeft }) => {
  const { handleDeleteTodo, preparedTodos } = useTodosContext();

  const completedTodos = preparedTodos.filter(todo => todo.completed);

  const hendlerDeleteTodos = () => {
    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <FilterTodos />
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={hendlerDeleteTodos}
        disabled={!completedTodos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
