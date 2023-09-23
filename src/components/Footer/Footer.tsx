import React from 'react';
import { Todo } from '../../types/Todo';
import { Navigation } from '../Navigation';
import { Filters } from '../../types/Filters';

type Props = {
  todos: Todo[]
  filterTodos: Filters
  setFilterTodos: (option: Filters) => void
};

export const Footer: React.FC<Props> = ({
  todos,
  filterTodos,
  setFilterTodos,
}) => {
  const itemsLeft = (): number => {
    const activeTasks = todos.filter((task) => !task.completed);

    return activeTasks.length;
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft()} items left`}
      </span>

      <Navigation filterTodos={filterTodos} setFilterTodos={setFilterTodos} />

      {/* don't show this button if there are no completed todos */}
      {todos.some((todo) => todo.completed) && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
