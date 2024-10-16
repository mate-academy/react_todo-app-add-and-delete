import React, { Dispatch, SetStateAction } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { Filter } from '../../types/FilterEnum';
import { getLinkHref } from '../../utils/getLinkHref';

interface Props {
  todos: Todo[];
  filter: Filter;
  onDelete: (todoId: number) => void;
  onFilterChange: Dispatch<SetStateAction<Filter>>;
}

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  onDelete,
  onFilterChange,
}) => {
  const linksValues = Object.values(Filter);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const handleDeleteCompletedTodos = () => {
    const completedTodos: Todo[] = todos.filter(todo => todo.completed);

    const completedTodosIds = completedTodos.map(
      completedTodo => completedTodo.id,
    );

    completedTodosIds.forEach(completedTodoId => {
      onDelete(completedTodoId);
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {linksValues.map(linkValue => (
          <a
            key={linkValue}
            href={getLinkHref(linkValue)}
            className={cn('filter__link', { selected: filter === linkValue })}
            data-cy={`FilterLink${linkValue}`}
            onClick={() => onFilterChange(linkValue)}
          >
            {linkValue}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={activeTodosCount === todos.length}
        onClick={handleDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
