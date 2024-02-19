import classNames from 'classnames';
import React, { useContext, useEffect } from 'react';
import { TodoFilter } from '../../types/enums/TodosFilter';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../../utils/context';
import { client } from '../../utils/fetchClient';

type Props = {
  todos: Todo[];
  filterChange: (filter: TodoFilter) => void;
  currentFilter: TodoFilter;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterChange,
  currentFilter,
}) => {
  const {
    setTodos,
    setListOfAllCompletedTodos,
    listOfAllCompletedTodos,
  } = useContext(TodosContext);

  const handledClearAllCompleted = () => {
    setListOfAllCompletedTodos(todos.filter(todo => todo.completed));
  };

  useEffect(() => {
    listOfAllCompletedTodos.forEach(item => {
      client.delete(`/todos/${item.id}`)
        .finally(() => {
          setTodos((pre) => pre.filter(todo => !todo.completed));
          setListOfAllCompletedTodos([]);
        });
    });
  }, [listOfAllCompletedTodos, setListOfAllCompletedTodos, setTodos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link',
            {
              selected: currentFilter === TodoFilter.All,
            })}
          onClick={() => filterChange(TodoFilter.All)}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link',
            {
              selected: currentFilter === TodoFilter.Active,
            })}
          data-cy="FilterLinkActive"
          onClick={() => filterChange(TodoFilter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link',
            {
              selected: currentFilter === TodoFilter.Completed,
            })}
          data-cy="FilterLinkCompleted"
          onClick={() => filterChange(TodoFilter.Completed)}
        >
          Completed
        </a>
      </nav>

      {todos.some((todo => todo.completed)) && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handledClearAllCompleted}
        >
          Clear completed
        </button>
      )}

    </footer>
  );
};
