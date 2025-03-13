import React, { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';
import cn from 'classnames';

type Props = {
  errorMessage: string;
  todos: Todo[];
  setFilterBy: Dispatch<SetStateAction<Filter>>;
  filterBy: string;
  todoCount: number;
  onClearTodo: () => Promise<void>;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterBy,
  setFilterBy,
  todoCount,
  onClearTodo,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {`${todoCount} items left`}
          </span>

          <nav className="filter" data-cy="Filter">
            {Object.values(Filter).map(item => (
              <a
                href={`#/${item}`}
                key={item}
                className={cn('filter__link', { selected: filterBy === item })}
                data-cy={`FilterLink${item}`}
                onClick={() => setFilterBy(item)}
              >
                {item}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className={cn('todoapp__clear-completed', {
              'todoapp__clear-completed--hidden': completedTodos.length === 0,
            })}
            data-cy="ClearCompletedButton"
            onClick={onClearTodo}
            disabled={completedTodos.length === 0}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
