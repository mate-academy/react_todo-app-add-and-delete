import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoFilter } from '../TodoFilter';
import { Filter } from '../../types/Filter';

type Props = {
  todos: Todo[];
  filterField: Filter;
  processingTodoIds: Todo['id'][];
  setFilterField: (filterField: Filter) => void;
  handleClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterField,
  processingTodoIds,
  setFilterField,
  handleClearCompleted,
}) => {
  const activeTodosCount = todos.filter(
    todo => !todo.completed && !processingTodoIds.includes(todo.id),
  ).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <TodoFilter filterField={filterField} setFilterField={setFilterField} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
