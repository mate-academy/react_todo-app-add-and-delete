import React, { useContext } from 'react';
import classNames from 'classnames';
import { FilterType } from '../../types/TodoStatus';
import { getActiveTodoQuantity, getCompletedTodoIds } from './helpers';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../../contexts/TodosContext';

interface Props {
  todos: Todo[]
}

export const TodoFooter: React.FC<Props> = ({ todos }) => {
  const {
    filterType,
    handleFilterChange,
    handleDeleteTodo,
  } = useContext(TodosContext);
  const activeTodosId: number = getActiveTodoQuantity(todos);
  const completedTodosId: number[] = getCompletedTodoIds(todos);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {
          `${activeTodosId} items left`
        }
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType)
          .map(type => (
            <a
              key={type}
              href="#/"
              data-cy={`FilterLink${type}`}
              className={classNames(
                'filter__link',
                {
                  selected: type === filterType,
                },
              )}
              onClick={() => handleFilterChange(type)}
            >
              {type}
            </a>
          ))}
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={activeTodosId === todos.length}
        onClick={() => handleDeleteTodo(...completedTodosId)}
      >
        Clear completed
      </button>
    </footer>
  );
};
