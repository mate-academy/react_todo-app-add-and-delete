import React from 'react';
import { FilterType } from '../types/FilterType';
import { TodoFilter } from './TodoFilter';
import { Todo } from '../types/Todo';

type Props = {
  todoList: Todo[];
  clearCompletedTodos: () => void;
  currentFilter: FilterType;
  setCurrentFilter: (filter: FilterType) => void;
};

export const Footer: React.FC<Props> = ({
  todoList,
  clearCompletedTodos,
  currentFilter,
  setCurrentFilter,
}) => {
  const activeTodosCount = todoList.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todoList.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} item${activeTodosCount !== 1 ? 's' : ''} left`}
      </span>

      <TodoFilter currentFilter={currentFilter} onChange={setCurrentFilter} />
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={() => clearCompletedTodos()}
      >
        Clear completed
      </button>
    </footer>
  );
};
