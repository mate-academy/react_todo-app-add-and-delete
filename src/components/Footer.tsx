import React from 'react';
import { Todo } from '../types/Todo';
import { FilterStatus } from '../types/FilterStatus';
import { Filter } from './Filter';

interface Props {
  todos: Todo[];
  filterStatus: FilterStatus;
  handleFilterChange: (status: FilterStatus) => void;
  handleDeleteTodo: (value: number) => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  filterStatus,
  handleFilterChange,
  handleDeleteTodo,
}) => {
  const completedTodos = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  const hasCompletedTodos = todos.some((todo: Todo) => todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter((todo: Todo) => !todo.completed).length} items left
      </span>

      <Filter
        filterStatus={filterStatus}
        handleFilterChange={handleFilterChange}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => completedTodos.forEach(handleDeleteTodo)}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
