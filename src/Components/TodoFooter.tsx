import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { FilterTodo } from '../types/FilterTodo';
import { Todo } from '../types/Todo';
import { filterTodo } from '../Services/Todo';
import { TodoContext } from '../Contexts/TodoContext';

type Filter = {
  label: string;
  href: string;
  dataCy: string;
  filter: FilterTodo;
};

type Props = {
  currentFilter: FilterTodo;
  todos: Todo[];
  onChangeFilter: (filter: FilterTodo) => void;
};

const TodoFooterComponent: React.FC<Props> = ({
  currentFilter,
  todos,
  onChangeFilter,
}) => {
  const [isStartDeleting, setIsStartDeleting] = useState(false);

  const filters: Filter[] = [
    {
      label: 'All',
      href: '#/',
      dataCy: 'FilterLinkAll',
      filter: FilterTodo.all,
    },
    {
      label: 'Active',
      href: '#/active',
      dataCy: 'FilterLinkActive',
      filter: FilterTodo.active,
    },
    {
      label: 'Completed',
      href: '#/completed',
      dataCy: 'FilterLinkCompleted',
      filter: FilterTodo.completed,
    },
  ];
  const { onDeleteTodo } = useContext(TodoContext);

  const completedTodos = filterTodo(todos, FilterTodo.completed);

  const deleteCompletedTodos = async () => {
    setIsStartDeleting(true);
    const promises = completedTodos.map(todo => onDeleteTodo(todo.id));

    try {
      await Promise.all(promises);
    } finally {
      setIsStartDeleting(false);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.length - completedTodos.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(({ label, href, dataCy, filter }) => (
          <a
            key={filter}
            href={href}
            data-cy={dataCy}
            onClick={() => onChangeFilter(filter)}
            className={classNames('filter__link', {
              selected: currentFilter === filter,
            })}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        onClick={deleteCompletedTodos}
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0 || isStartDeleting}
      >
        Clear completed
      </button>
    </footer>
  );
};

export const TodoFooter = React.memo(TodoFooterComponent);
