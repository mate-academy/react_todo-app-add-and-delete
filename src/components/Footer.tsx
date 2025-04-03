import React from 'react';
import { TodoFilter } from './TodoFilter';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

type Props = {
  todoList: Todo[];
  deleteTodos: (todoId: number) => void;
  currentFilter: FilterType;
  onFilterChange: (status: FilterType) => void;
};

export const Footer: React.FC<Props> = ({
  todoList,
  deleteTodos,
  currentFilter,
  onFilterChange: onChange,
}) => {
  const activeTodosCount = todoList.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todoList.some(todo => todo.completed);
  const completedTodoIds = todoList
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} item${activeTodosCount !== 1 ? 's' : ''} left`}
      </span>

      <TodoFilter currentFilter={currentFilter} onChange={onChange} />
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={() => completedTodoIds.forEach(deleteTodos)}
      >
        Clear completed
      </button>
    </footer>
  );
};
