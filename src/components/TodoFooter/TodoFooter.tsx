import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoFilter } from '../TodoFilter';
import { FilterTodo } from '../../types/Filter';

type Props = {
  todos: Todo[];
  filter: FilterTodo;
  setFilter: (value: FilterTodo) => void;
  onClearCompleted: () => void;
};
export const TodoFooter: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  onClearCompleted,
}) => {
  const completedTodo = todos.some(todo => todo.completed === true);
  const filteredCompletedTodo = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${filteredCompletedTodo.length} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <TodoFilter filter={filter} setFilter={setFilter} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodo}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
