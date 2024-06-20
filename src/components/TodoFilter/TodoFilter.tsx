import React, { useMemo } from 'react';
import cn from 'classnames';

import { OPTIONS_TODOS } from '../../constans';
import { getTodos } from '../../services/todos';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  option: string;
  onOption: (option: string) => void;
  onDelete?: (todosId: number[]) => void;
}

export const TodoFilter: React.FC<Props> = React.memo(
  function TodoFilterComponent({
    todos,
    option,
    onOption,
    onDelete = () => {},
  }) {
    const activeTodos = useMemo(() => getTodos.active(todos), [todos]);
    const IsOneCompletedTodo = useMemo(
      () => getTodos.isOneCompleted(todos),
      [todos],
    );

    const allCompletedTodoId = useMemo(
      () => getTodos.allCompletedId(todos),
      [todos],
    );

    return (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {activeTodos} items left
        </span>

        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={cn('filter__link', {
              selected: option === OPTIONS_TODOS.ALL,
            })}
            data-cy="FilterLinkAll"
            onClick={() => onOption(OPTIONS_TODOS.ALL)}
          >
            All
          </a>

          <a
            href="#/active"
            className={cn('filter__link', {
              selected: option === OPTIONS_TODOS.ACTIVE,
            })}
            data-cy="FilterLinkActive"
            onClick={() => onOption(OPTIONS_TODOS.ACTIVE)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={cn('filter__link', {
              selected: option === OPTIONS_TODOS.COMPLETED,
            })}
            data-cy="FilterLinkCompleted"
            onClick={() => onOption(OPTIONS_TODOS.COMPLETED)}
          >
            Completed
          </a>
        </nav>
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={!IsOneCompletedTodo}
          onClick={() => onDelete(allCompletedTodoId)}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);
