import React from 'react';
import { Filter } from '../Filter';
import { useTodos } from '../TodosProvider';

export const Footer: React.FC = () => {
  const { todos, clearCompletedTodos } = useTodos();

  const quantityTodos: number = todos.filter(todo => !todo.completed).length;
  const hasOnlyNotCompletedTodos: boolean = todos.every(
    todo => !todo.completed,
  );

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {quantityTodos} items left
      </span>

      <Filter />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompletedTodos}
        disabled={hasOnlyNotCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
