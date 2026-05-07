import React, { useCallback, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todosFormServer: Todo[] | null;
  setTodos: (todos: Todo[]) => void;
  updateList: () => void;
  deleteTodo: (id: number, todo: Todo) => void;
};

enum TypeFilter {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

function getCount(serverTodos: Todo[] | null) {
  let count = 0;

  if (serverTodos && serverTodos.length > 0) {
    serverTodos.forEach(todo => {
      if (todo.completed === false) {
        count++;
      }
    });
  }

  return count;
}

type ArrayButtons = {
  title: string;
  href: string;
  typeFilter: TypeFilter;
  id: number;
  link: string;
};

const arrayButtons: ArrayButtons[] = [
  {
    title: 'All',
    href: '#/',
    typeFilter: TypeFilter.All,
    id: 1,
    link: 'FilterLinkAll',
  },
  {
    title: 'Active',
    href: '#/active',
    typeFilter: TypeFilter.Active,
    id: 2,
    link: 'FilterLinkActive',
  },
  {
    title: 'Completed',
    href: '#/completed',
    typeFilter: TypeFilter.Completed,
    id: 3,
    link: 'FilterLinkCompleted',
  },
];

export const Filter: React.FC<Props> = ({
  setTodos,
  updateList,
  todosFormServer,
  deleteTodo,
}) => {
  const [selectedFilter, setSelectedFilter] = useState(TypeFilter.All);

  const onlyActive = useCallback(() => {
    if (todosFormServer) {
      const newTodos: Todo[] = todosFormServer.filter((todo: Todo) => {
        return todo.completed === false;
      });

      setTodos(newTodos);
    }
  }, [todosFormServer, setTodos]);

  const onlyCompleted = useCallback(() => {
    if (todosFormServer) {
      const newTodos: Todo[] = todosFormServer.filter((todo: Todo) => {
        return todo.completed === true;
      });

      setTodos(newTodos);
    }
  }, [todosFormServer, setTodos]);

  const clearCompleted = useCallback(() => {
    if (todosFormServer) {
      const needDelete = todosFormServer.map((todo: Todo) => {
        if (todo.completed === true) {
          return deleteTodo(todo.id, todo);
        }
      });

      Promise.all(needDelete);
    }
  }, [todosFormServer, deleteTodo]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${getCount(todosFormServer)} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {arrayButtons.map(button => (
          <a
            href={button.href}
            key={button.id}
            className={classNames('filter__link', {
              selected: selectedFilter === button.typeFilter,
            })}
            data-cy={button.link}
            onClick={e => {
              e.preventDefault();
              setSelectedFilter(button.typeFilter);
              if (button.typeFilter === TypeFilter.All) {
                updateList();
              } else if (button.typeFilter === TypeFilter.Active) {
                onlyActive();
              } else {
                onlyCompleted();
              }
            }}
          >
            {button.title}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todosFormServer?.some(todo => todo.completed === true)}
        onClick={() => {
          clearCompleted();
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
