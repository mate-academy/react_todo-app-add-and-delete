import React from 'react';
import { TodoFilter } from '../TodoFilter/TodoFilter';
import { Todo } from '../../types/Todo';
import { Status } from '../../enums/Status';
import { deleteTodo } from '../../api/todos';

type Props = {
  todos: Todo[],
  filter: Status,
  updateFilter: (newFilter: Status) => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  updateFilter,
}) => {
  const handleClearCompleted = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();

    todos
      .filter(todo => todo.completed)
      .map(item => item.id)
      .forEach(id => deleteTodo(id));
  };

  const uncompletedTodoCount = todos.filter(
    todo => !todo.completed,
  ).length;

  const completedTodoCount = todos.length - uncompletedTodoCount;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${uncompletedTodoCount} ${uncompletedTodoCount === 1 ? 'item' : 'items'} left`}
      </span>

      <TodoFilter
        filter={filter}
        updateFilter={(newFilter: Status) => updateFilter(newFilter)}
      />

      {completedTodoCount > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
