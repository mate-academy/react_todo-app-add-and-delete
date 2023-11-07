import React from 'react';
import { Todo } from './types/Todo';
import { FilterBy } from './types/FilterBy';
import { TodoFilter } from './TodoFilter';

interface TodoFooterProps {
  todos: Todo[];
  filterBy: FilterBy;
  handleFilterClick: (filterType: FilterBy) =>
  (event: React.MouseEvent) => void;
  clearCompletedTodos: () => void;
}

export const TodoFooter: React.FC<TodoFooterProps> = ({
  todos, filterBy, handleFilterClick, clearCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>

      <TodoFilter
        filterBy={filterBy}
        handleFilterClick={handleFilterClick}
      />

      {todos.some(todo => todo.completed) && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={clearCompletedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
