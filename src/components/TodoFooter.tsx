import React, { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import { Filters } from '../types/Filters';
import { TodoFilter } from './TodoFilter';

type Props = {
  currentFilter: Filters;
  setCurrentFilter: Dispatch<SetStateAction<Filters>>;
  todos: Todo[];
  handleClearCompleted: () => Promise<void>;
};

const areAllTodosIncomplete = (todos: Todo[]) =>
  todos.every((todo: Todo) => !todo.completed);

export const TodoFooter: React.FC<Props> = ({
  todos,
  handleClearCompleted,
  currentFilter,
  setCurrentFilter,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      <TodoFilter
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={areAllTodosIncomplete(todos)}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
