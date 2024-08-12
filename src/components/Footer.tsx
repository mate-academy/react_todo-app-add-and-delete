import React from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  todos: Todo[];
  onFilter: React.Dispatch<React.SetStateAction<Filter>>;
  filter: string;
  onDelete: (postId: number) => Promise<unknown>;
};

export const Footer: React.FC<Props> = ({
  todos,
  onFilter,
  filter,
  onDelete,
}) => {
  const hasCompletedTodos = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  const handleDeleteAllCompleted = (todosId: number[]) => {
    todosId.map(id => onDelete(id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(value => (
          <a
            key={value}
            href={`#/${value}`}
            className={cn('filter__link', {
              selected: filter === value,
            })}
            data-cy={`FilterLink${value}`}
            onClick={() => onFilter(value)}
          >
            {value}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos.length}
        onClick={() => handleDeleteAllCompleted(hasCompletedTodos)}
      >
        Clear completed
      </button>
    </footer>
  );
};
